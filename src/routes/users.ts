import express, { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUser, getUserById, getValidatedUser } from '../models/user';

const prisma = new PrismaClient()

interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user without password
 *     tags:
 *       - users                    # Add the "users" tag here
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A user object without the password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithOutPassword'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user = await getUserById(userId);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

router.post('/signout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'You have successfully signed out!' });
    res.end();
  });
});

router.post('/signup', async (req: Request<{}, {}, UserRequestBody>, res) => {
  const { name, password, email } = req.body;
  try {
    const user = await createUser(name, email, password);
    req.session.userId = user.id;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while signing up' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getValidatedUser(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    // User exists and password is correct
    req.session.userId = user.id;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while signing in' });
  }
});

export default router;
