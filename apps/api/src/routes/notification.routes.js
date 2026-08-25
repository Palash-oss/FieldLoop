const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// GET /api/v1/notifications
router.get('/', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: [
      { id: '1', title: 'New Job Assigned', message: 'Job #8492 assigned to M. Torres', time: '10m ago', unread: true },
      { id: '2', title: 'Status Change', message: 'Job #8493 marked as Completed', time: '1h ago', unread: true },
      { id: '3', title: 'Payment Received', message: 'Invoice #INV-2026-001 paid ($450.00)', time: '3h ago', unread: false },
    ],
  });
});

module.exports = router;
