FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json .
COPY --from=builder /app/dist .
COPY --from=builder /app/prisma ./prisma

RUN npm install --only=production
RUN npx prisma generate

CMD ["node", "src/app.js"]
