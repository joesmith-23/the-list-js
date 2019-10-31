const express = require('express');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');
const groupRoutes = require('./routes/groupRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();

// GLOBAL MIDDLEWEAR
// Body parser, limits the amount of data that can be sent
app.use(express.json({ limit: '10kb' }));

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/groups', groupRoutes);

// If URL doesn't exist, this returns JSON instead of default HTML
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
