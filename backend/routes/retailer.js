import express from 'express';

const router = express.Router();

// GET /api/retailer/inventory
router.get('/inventory', (req, res) => {
  res.json([
    {
      id: 1,
      magazineId: 1,
      quantity: 50,
      status: 'in_stock'
    }
  ]);
});

// POST /api/retailer/inventory
router.post('/inventory', (req, res) => {
  const inventoryData = req.body;
  res.status(201).json({
    id: Date.now(),
    ...inventoryData,
    message: 'Inventory item created successfully'
  });
});

// PUT /api/retailer/inventory/:id
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const inventoryData = req.body;
  res.json({
    id,
    ...inventoryData,
    message: 'Inventory updated successfully'
  });
});

// DELETE /api/retailer/inventory/:id
router.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Inventory item ${id} deleted successfully` });
});

export default router;