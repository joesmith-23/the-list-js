const express = require('express');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();

// GLOBAL MIDDLEWEAR
// Body parser, limits the amount of data that can be sent
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/groups', groupRoutes);

module.exports = app;
