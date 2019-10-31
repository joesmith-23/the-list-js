const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Global Uncaught Exception error fix
process.on('uncaughtException', err => {
  console.log('\nUNCAUGHT EXCEPTION: Shutting down...\n');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to Database');
  });

// START SERVER
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}...`)
);

// Global Unhandled Rejection error fix
process.on('unhandledRejection', err => {
  console.log('\nUNHANDLED REJECTION: Shutting down...\n');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
