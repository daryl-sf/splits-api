import RedisStore from "connect-redis"
import dotenv from 'dotenv';
import express, { Router } from 'express';
import session from 'express-session';
import { createClient } from 'redis';

import { usersRouter, clubsRouter } from './routes';

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Load environment variables
dotenv.config();
const port = process.env.port || '3000';
const host = process.env.host || 'localhost';
if(!process.env.JWT_SECRET) {
  console.error('❌ No JWT secret set. Exiting...');
  process.exit(1);
}

// Create a Redis client and store
let redisClient: ReturnType<typeof createClient>;
try {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect();
  console.log('✅ Connected to Redis');
} catch (error) {
  console.error('❌ Error connecting to Redis:', error);
  process.exit(1);
}

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "splitsApi:",
})

// Create an Express app and API router
const app = express();
const apiRouter = Router();

// Set up middleware
app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
});
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax'
  },
  store: redisStore,
}));
app.use(express.json())

app.get('/healthcheck', (_, res) => {
  res.json({ message: '🚀 Server is up and running!' });
});
app.use('/api', apiRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/clubs', clubsRouter);


// Start the server
const server = app.listen(port, () => {
  console.log(`✅ Server is running at https://${host}:${port}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.debug('HTTP server closed')
  })
})
