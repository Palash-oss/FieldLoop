const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const locationRoutes = require('./routes/location.routes');
const notificationRoutes = require('./routes/notification.routes');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/location', locationRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FieldLoop API is online' });
});

module.exports = app;
