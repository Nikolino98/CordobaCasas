import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateAdmin } from '../models/adminModel.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide username and password' });
    }
    
    const admin = await authenticateAdmin(username, password);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(admin.id);
    
    res.json({
      id: admin.id,
      username: admin.username,
      token
    });
  } catch (error) {
    console.error('Error in POST /auth/login:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;