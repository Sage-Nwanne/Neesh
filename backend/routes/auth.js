import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email,
          password_hash: hashedPassword,
          role: role?.toLowerCase() || 'retailer'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ 
        message: error.message.includes('duplicate') ? 'User already exists' : 'Registration failed',
        error: error.message 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
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
