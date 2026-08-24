const express = require('express');
const router = express.Router();
const invoiceController = require('../controller/invoice.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// All invoice routes require JWT Login
router.use(protect);

router.post('/', authorize('OWNER', 'DISPATCHER', 'TECHNICIAN'), invoiceController.create);
router.get('/', authorize('OWNER', 'DISPATCHER', 'ACCOUNTANT'), invoiceController.getAll);
router.get('/:id', authorize('OWNER', 'DISPATCHER', 'ACCOUNTANT', 'TECHNICIAN'), invoiceController.getOne);
router.patch('/:id/status', authorize('OWNER', 'DISPATCHER', 'ACCOUNTANT', 'TECHNICIAN'), invoiceController.updateStatus);

module.exports = router;
