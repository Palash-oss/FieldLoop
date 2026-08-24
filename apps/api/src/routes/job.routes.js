const express = require('express');
const router = express.Router();
const jobController = require('../controller/job.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

// All job routes require JWT Login
router.use(protect);

// Mobile App View: Technician gets their own assigned jobs
router.get('/my-jobs', authorize('TECHNICIAN', 'OWNER', 'DISPATCHER'), jobController.getMyJobs);

// Job Status Transition (Technician updates status to EN_ROUTE, IN_PROGRESS, COMPLETED)
router.patch('/:id/status', authorize('TECHNICIAN', 'DISPATCHER', 'OWNER'), jobController.updateStatus);

// Dispatcher & Owner Routes
router.post('/', authorize('OWNER', 'DISPATCHER'), jobController.create);
router.get('/', authorize('OWNER', 'DISPATCHER'), jobController.getAll);
router.get('/:id', authorize('OWNER', 'DISPATCHER', 'TECHNICIAN'), jobController.getOne);
router.put('/:id', authorize('OWNER', 'DISPATCHER'), jobController.update);
router.delete('/:id', authorize('OWNER'), jobController.delete);

module.exports = router;
