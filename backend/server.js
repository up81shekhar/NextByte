import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';
import adminRoutes from './routes/admin.js';
import { SitemapStream, streamToPromise } from 'sitemap';
import QuestionModel from './models/Question.js'; // Ensure path is correct

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// ── MIDDLEWARE ──
app.use(cors({
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Private Network Access & CORS Headers Fix
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🔌 Connected to MongoDB Successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// Sitemap Route (Dynamic)
app.get('/sitemap.xml', async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: 'https://nextbyte-gold.vercel.app/' });

    const questions = await QuestionModel.find({}); 

    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });

    questions.forEach(q => {
      smStream.write({ url: `/question/${q._id}`, changefreq: 'weekly', priority: 0.7 });
    });

    smStream.end();

    const data = await streamToPromise(smStream);
    res.header('Content-Type', 'application/xml');
    res.send(data);
  } catch (e) {
    console.error("Sitemap error:", e);
    res.status(500).send("Error generating sitemap");
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('NextByte Backend Server is running successfully!');
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});