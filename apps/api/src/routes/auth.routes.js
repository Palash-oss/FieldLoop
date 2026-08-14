const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller')

// Route 1: Register Organization & Owner
router.post('/register', authController.register);

// Route 2: Login
router.post('/login', authController.login);

module.exports = router;
