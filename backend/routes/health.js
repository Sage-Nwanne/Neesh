import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NEESH API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

export default router;