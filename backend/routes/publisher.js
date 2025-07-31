import express from 'express';

const router = express.Router();

// GET /api/publisher/magazines
router.get('/magazines', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Sample Magazine',
      description: 'A sample magazine',
      price: 9.99,
      category: 'lifestyle'
    }
  ]);
});

// POST /api/publisher/magazines
router.post('/magazines', (req, res) => {
  const magazineData = req.body;
  res.status(201).json({
    id: Date.now(),
    ...magazineData,
    message: 'Magazine created successfully'
  });
});

// PUT /api/publisher/magazines/:id
router.put('/magazines/:id', (req, res) => {
  const { id } = req.params;
  const magazineData = req.body;
  res.json({
    id,
    ...magazineData,
    message: 'Magazine updated successfully'
  });
});

// DELETE /api/publisher/magazines/:id
router.delete('/magazines/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Magazine ${id} deleted successfully` });
});

export default router;