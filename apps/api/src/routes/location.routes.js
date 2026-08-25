const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// POST /api/v1/location/ping
router.post('/ping', protect, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ status: 'fail', message: 'lat and lng required' });
    }

    await User.findByIdAndUpdate(req.user.userId, {
      currentLocation: {
        lat,
        lng,
        updatedAt: new Date(),
        status: 'EN_ROUTE',
      },
    });

    res.status(200).json({ status: 'success', message: 'Location ping received' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
