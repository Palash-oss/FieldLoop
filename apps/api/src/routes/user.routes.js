const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// All user routes require JWT Login
router.use(protect);

// GPS Location Ping (Technicians update their location)
router.patch('/location', authorize('TECHNICIAN', 'OWNER'), userController.updateLocation);

// Staff Management Routes
router.post('/', authorize('OWNER'), userController.create);
router.get('/', authorize('OWNER', 'DISPATCHER'), userController.getAll);
router.get('/:id', authorize('OWNER', 'DISPATCHER'), userController.getOne);
router.put('/:id', authorize('OWNER'), userController.update);
router.delete('/:id', authorize('OWNER'), userController.delete);

module.exports = router;
