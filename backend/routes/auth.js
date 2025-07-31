import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement actual authentication logic
    // For now, return a mock response
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: 1,
        username: 'testuser',
        email: email,
        role: 'retailer'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // TODO: Implement actual signup logic
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: role?.toLowerCase() || 'retailer', // Normalize to lowercase
      createdAt: new Date()
    };
    users.push(user);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, username, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  // TODO: Implement JWT verification
  res.json({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'retailer'
  });
});

export default router;
