import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🔌 Connected to MongoDB Successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('NextByte Backend Server is running and database connection is being established!');
});

// ── ROUTE ──
app.get('/', (req, res) => {
  res.send('NextByte Backend Server is running successfully!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});