const express = require('express');
const router = express.Router();
const customerController = require('../controller/customer.controller')
const {protect} = require('../middleware/auth.middleware')
const {authorize} = require('../middleware/rbac.middleware');


// Protect all customer routes (Require JWT Login)
router.use(protect);

// Routes
router.post('/', authorize('OWNER', 'DISPATCHER'), customerController.create);
router.get('/', authorize('OWNER', 'DISPATCHER'), customerController.getAll);
router.get('/:id', authorize('OWNER', 'DISPATCHER'), customerController.getOne);
router.put('/:id', authorize('OWNER', 'DISPATCHER'), customerController.update);
router.delete('/:id', authorize('OWNER'), customerController.delete); // Owner only
module.exports = router;