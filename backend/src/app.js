const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// TODO: Add routes here
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Sync DB
db.sequelize.sync().then(() => {
  console.log('Database synced');
});

module.exports = app; 