import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Question from '../models/Question.js';
import multer from 'multer';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

// ✨ THE FIX: Using a modern, actively maintained PDF library!
import pdfParse from 'pdf-extraction';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'NEXTBYTE_SUPER_SECRET_KEY';

// ── MIDDLEWARE: VERIFY JWT SECURITY TOKEN ──
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

// ── 1. GUARDED ADMIN REGISTRATION ──
router.post('/register', async (req, res) => {
  try {
    const { username, password, secretAdminKey } = req.body;
    if (secretAdminKey !== process.env.ADMIN_SECRET_PASSPHRASE) {
      return res.status(403).json({ message: 'Registration Denied: Invalid Admin Creation Secret Key.' });
    }
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: 'Admin username already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Administrative user registered successfully.' });
  } catch (err) { res.status(500).json({ message: 'Registration failed.', error: err.message }); }
});

// ── 2. ADMIN LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid username or credentials.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or credentials.' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Authentication verified!' });
  } catch (err) { res.status(500).json({ message: 'Login execution failed.', error: err.message }); }
});

// ── 3. CREATE NEW COURSE ──
router.post('/courses', verifyToken, async (req, res) => {
  try {
    const { name, fullName, icon, semestersCount } = req.body;
    const newCourse = await Course.create({ name, fullName, icon, semestersCount });
    res.status(201).json(newCourse);
  } catch (err) { res.status(400).json({ message: 'Failed to create course.', error: err.message }); }
});

// ── 4. DELETE COURSE & ALL UNDERLYING DATA ──
router.delete('/courses/:id', verifyToken, async (req, res) => {
  try {
    const courseId = req.params.id;
    const subjects = await Subject.find({ courseId });
    const subjectIds = subjects.map(s => s._id);
    await Question.deleteMany({ subjectId: { $in: subjectIds } });
    await Subject.deleteMany({ courseId });
    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Course and all related subjects and questions deleted cleanly!' });
  } catch (err) { res.status(500).json({ message: 'Deletion timeline failed.', error: err.message }); }
});

// ── 5. CREATE NEW SUBJECT ──
router.post('/subjects', verifyToken, async (req, res) => {
  try {
    const { courseId, semester, name, slug } = req.body;
    const newSubject = await Subject.create({ courseId, semester, name, slug: slug.toLowerCase() });
    res.status(201).json(newSubject);
  } catch (err) { res.status(400).json({ message: 'Failed to create subject.', error: err.message }); }
});

// ── 6. DELETE SUBJECT & ITS QUESTIONS ──
router.delete('/subjects/:id', verifyToken, async (req, res) => {
  try {
    const subjectId = req.params.id;
    await Question.deleteMany({ subjectId });
    await Subject.findByIdAndDelete(subjectId);
    res.json({ message: 'Subject and related questions wiped successfully.' });
  } catch (err) { res.status(500).json({ message: 'Subject deletion failed.', error: err.message }); }
});

// ── 7. UPLOAD A NEW MCQ QUESTION ──
router.post('/questions', verifyToken, async (req, res) => {
  try {
    const { subjectId, questionText, options, correctAnswerIndex, explanation } = req.body;
    if (!subjectId || !questionText || !options || correctAnswerIndex === undefined || !explanation) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (options.length !== 4) return res.status(400).json({ message: 'An MCQ must contain exactly 4 options.' });

    const newQuestion = await Question.create({ subjectId, questionText, options, correctAnswerIndex: parseInt(correctAnswerIndex), explanation });
    res.status(201).json({ message: 'Question uploaded successfully!', question: newQuestion });
  } catch (error) { res.status(500).json({ message: 'Failed to upload question.', error: error.message }); }
});

// ── 8. FETCH ALL QUESTIONS FOR A SPECIFIC SUBJECT ──
router.get('/questions/:subjectId', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ subjectId: req.params.subjectId });
    res.json(questions);
  } catch (err) { res.status(500).json({ message: 'Failed to fetch questions.', error: err.message }); }
});

router.post("/import-url", verifyToken, async (req, res) => {
  try {
    const { url } = req.body;

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const text = $("body").text();

    const questions = extractMCQs(text);

    res.json({
      totalQuestions: questions.length,
      questions
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ── 9. UPDATE A SPECIFIC QUESTION ──
router.put('/questions/:id', verifyToken, async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Question updated successfully!', question: updatedQuestion });
  } catch (err) { res.status(500).json({ message: 'Failed to update question.', error: err.message }); }
});

// ── 10. DELETE A SPECIFIC QUESTION ──
router.delete('/questions/:id', verifyToken, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) { res.status(500).json({ message: 'Deletion failed.', error: err.message }); }
});

// ── 11. AUTO-GENERATE MCQS FROM PDF (BULK CHUNKING) ──
router.post('/generate-pdf', verifyToken, upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF file uploaded." });

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) return res.status(500).json({ message: "API Key missing in .env file!" });

    const openai = new OpenAI({
      apiKey: apiKey, 
      baseURL: "https://openrouter.ai/api/v1", // UNCOMMENT FOR OPENROUTER
    });

    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    // ✨ THE FIX: TEXT CHUNKING ✨
    // Hum PDF ko 20,000 characters ke tukdon mein baant rahe hain (Approx 10-15 pages per chunk)
    const chunkSize = 20000; 
    const textChunks = [];
    for (let i = 0; i < extractedText.length; i += chunkSize) {
      textChunks.push(extractedText.substring(i, i + chunkSize));
    }

    let allGeneratedQuestions = [];

    // Loop through each chunk one by one
    for (let i = 0; i < textChunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${textChunks.length}...`);
      
      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini", 
        response_format: { type: "json_object" }, 
        messages: [
          {
            role: "system",
            content: `You are an educational AI. Extract ALL multiple-choice questions from the provided text.
            You MUST return a JSON object containing an array named "questions". 
            Format EXACTLY like this:
            {
              "questions": [
                {
                  "questionText": "...",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswerIndex": 0,
                  "explanation": "..."
                }
              ]
            }`
          },
          {
            role: "user",
            content: `Extract all MCQs from this part of the document:\n\n${textChunks[i]}`
          }
        ]
      });

      const rawJson = response.choices[0].message.content;
      
      // JSON Salvager for each chunk
      try {
        const parsedData = JSON.parse(rawJson);
        if (parsedData.questions) {
          allGeneratedQuestions.push(...parsedData.questions);
        }
      } catch (parseError) {
        console.warn(`Chunk ${i + 1} cut off. Salvaging...`);
        const lastCompleteObject = rawJson.lastIndexOf('}');
        if (lastCompleteObject !== -1) {
          const salvagedStr = rawJson.substring(0, lastCompleteObject + 1) + "\n]}";
          try {
            const salvagedData = JSON.parse(salvagedStr);
            allGeneratedQuestions.push(...salvagedData.questions);
          } catch (e) { console.error(`Failed to salvage chunk ${i + 1}`); }
        }
      }
    } // End of loop

    console.log(`✅ Successfully extracted a total of ${allGeneratedQuestions.length} questions!`);
    res.json(allGeneratedQuestions); 

  } catch (error) {
    console.error("OpenAI PDF Error:", error);
    res.status(500).json({ message: 'AI PDF Extraction failed.', error: error.message });
  }
});

// ── 12. BULK SAVE GENERATED MCQS ──
router.post('/questions/bulk', verifyToken, async (req, res) => {
  try {
    const { questions } = req.body;
    await Question.insertMany(questions);
    res.status(201).json({ message: `${questions.length} questions saved successfully!` });
  } catch (error) { res.status(500).json({ message: 'Bulk save failed.', error: error.message }); }
});


// ── 13. AUTO-GENERATE FROM URL (Fixed with User-Agent) ──
router.post('/generate-url', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    
    // ✨ FIX: User-Agent header daala taaki website block na kare
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    // Saara script/style hata do taaki sirf text mile
    $('script, style, noscript, header, footer, nav').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY, 
      baseURL: "https://openrouter.ai/api/v1" 
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Extract all MCQs from the text provided." },
        { role: "user", content: `Extract MCQs from this text: ${text.substring(0, 15000)}` }
      ]
    });

    res.json(JSON.parse(response.choices[0].message.content).questions);
  } catch (error) {
    console.error("URL Scrape Error:", error.message);
    res.status(500).json({ message: "URL Extraction failed (403/Blocked): " + error.message });
  }
});


export default router;