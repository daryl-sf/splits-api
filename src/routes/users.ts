import { User, Club } from '@models/index';
import express, { Request } from 'express';


interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

const router = express.Router();

router.get('/me', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const user = await User.getUserById(userId);
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
    const user = await User.create(name, email, password);
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
    const user = await User.getValidatedUser(email, password);
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

router.get('/clubs', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const clubs = await Club.getClubs(userId);
  res.json(clubs);
});

router.get('/owned-clubs', async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const clubs = await Club.getOwnedClubs(userId);
  res.json(clubs);
});

export default router;
