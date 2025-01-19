import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

import { Club } from '@models/club';

const prisma = new PrismaClient();

interface ClubRequestBody {
  name: string;
  bio: string;
}

const router = express.Router();

router.post('/new', async (req: Request<{}, {}, ClubRequestBody>, res: Response) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const { name, bio } = req.body;
  const club = await Club.create(name, bio, userId);

  res.json(club);
});

export default router;
