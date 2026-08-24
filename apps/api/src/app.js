const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Essential: Allows Express to read JSON body sent by Postman!

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FieldLoop API is online' });
});

module.exports = app;
