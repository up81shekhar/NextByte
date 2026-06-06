import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';
import { SitemapStream, streamToPromise } from 'sitemap';

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// ── MIDDLEWARE ──
app.use(cors({
  origin: '*', // Sab allow kar do
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
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

app.get('/sitemap.xml', async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://nextbyte-gold.vercel.app/' });

    // 1. Database se saare questions fetch karo
    const questions = await QuestionModel.find({}); 

    // 2. Default links add karo
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });

    // 3. Dynamic links (saare questions) add karo
    questions.forEach(q => {
      smStream.write({ url: `/question/${q._id}`, changefreq: 'weekly', priority: 0.7 });
    });

    smStream.end();

    // 4. XML response bhejo
    const data = await streamToPromise(smStream);
    res.header('Content-Type', 'application/xml');
    res.send(data);
  } catch (e) {
    res.status(500).end();
  }
});

// ── ROUTE ──
app.get('/', (req, res) => {
  res.send('NextByte Backend Server is running successfully!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});