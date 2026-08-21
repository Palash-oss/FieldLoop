const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const customerRoutes = require('./routes/customer.routes');
const userRoutes = require('./routes/user.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Essential: Allows Express to read JSON body sent by Postman!

// Mount Auth Routes
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/customers', customerRoutes);

app.use('/api/v1/users', userRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'FieldLoop API is online' });
});

module.exports = app;
