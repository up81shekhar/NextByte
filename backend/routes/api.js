import express from 'express';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Question from '../models/Question.js';

const router = express.Router();

// ── 1. FETCH ALL COURSES (For LandingPage Cards) ──
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching courses.', error: error.message });
  }
});

// ── 2. FETCH SUBJECTS BY COURSE NAME (For SubjectsPage) ──
router.get('/courses/:courseName/subjects', async (req, res) => {
  try {
    const { courseName } = req.params;

    // Find the course by name case-insensitively (e.g., "bca" -> "BCA")
    const course = await Course.findOne({ name: new RegExp(`^${courseName}$`, 'i') });
    
    if (!course) {
      return res.status(404).json({ message: `Course '${courseName}' not found.` });
    }

    // Find all subjects that point to this course's unique ID
    const subjects = await Subject.find({ courseId: course._id }).sort({ semester: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching subjects.', error: error.message });
  }
});

// ── 3. FETCH PAGINATED QUESTIONS BY SUBJECT SLUG (For McqPage) ──
router.get('/subjects/:subjectSlug/questions', async (req, res) => {
  try {
    const { subjectSlug } = req.params;
    
    // Parse pagination query parameters from URL (e.g., ?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    // Find the subject by its slug identifier
    const subject = await Subject.findOne({ slug: subjectSlug.toLowerCase() });
    
    if (!subject) {
      return res.status(404).json({ message: `Subject with slug '${subjectSlug}' not found.` });
    }

    // Query questions matching the subjectId, apply pagination skip and limits
    const questions = await Question.find({ subjectId: subject._id })
      .skip(skipIndex)
      .limit(limit);

    // Get the grand total count of questions for this subject to manage frontend pagination links
    const totalQuestions = await Question.countDocuments({ subjectId: subject._id });

    res.json({
      subjectName: subject.name,
      semester: subject.semester,
      totalQuestions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching questions.', error: error.message });
  }
});

// ── 4. UPLOAD A NEW MCQ QUESTION (Admin Tool) ──
router.post('/questions', async (req, res) => {
  try {
    const { subjectId, questionText, options, correctAnswerIndex, explanation } = req.body;

    // Strict validation check before touching the database
    if (!subjectId || !questionText || !options || correctAnswerIndex === undefined || !explanation) {
      return res.status(400).json({ message: 'All fields are required to upload a question.' });
    }

    if (options.length !== 4) {
      return res.status(400).json({ message: 'An MCQ must contain exactly 4 options.' });
    }

    // Create and save the document to MongoDB
    const newQuestion = await Question.create({
      subjectId,
      questionText,
      options,
      correctAnswerIndex: parseInt(correctAnswerIndex),
      explanation
    });

    res.status(201).json({ message: 'Question uploaded successfully!', question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload question.', error: error.message });
  }
});

// ── GET SINGLE QUESTION BY ID (SEO Pages ke liye) ──
router.get('/questions/:id', async (req, res) => {
  try {
    // 1. URL se ID nikalna
    const questionId = req.params.id;

    // 2. Database mein us specific ID ko dhoondhna
    const question = await QuestionModel.findById(questionId);

    // 3. Agar question nahi mila toh 404 (Not Found) return karna
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 4. Agar mil gaya toh JSON format mein frontend ko bhej dena
    res.status(200).json(question);
    
  } catch (error) {
    // Agar galti se galat format ki ID aa jaye toh server crash hone se bachana
    console.error("Error fetching single question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;