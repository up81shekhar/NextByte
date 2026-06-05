import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Subject from './models/Subject.js';
import Question from './models/Question.js';

dotenv.config();

const seedData = async () => {
  try {
    // 1. Open the connection to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Seeding engine connected to MongoDB...');

    // 2. Clear out any existing data to avoid duplications
    await Question.deleteMany({});
    await Subject.deleteMany({});
    await Course.deleteMany({});
    console.log('🗑️ Existing database collections wiped clean.');

    // 3. Create top-level Courses
    const bcaCourse = await Course.create({
      name: 'BCA',
      fullName: 'Bachelor of Computer Applications',
      icon: '💻',
      semestersCount: 6
    });

    const mcaCourse = await Course.create({
      name: 'MCA',
      fullName: 'Master of Computer Applications',
      icon: '🚀',
      semestersCount: 4
    });

    console.log('✅ Base Courses successfully initialized.');

    // 4. Create a Subject linked to BCA
    const cProgSubject = await Subject.create({
      courseId: bcaCourse._id, // Establishes the relationship
      semester: 1,
      name: 'C Programming',
      slug: 'c-programming'
    });

    const digitalElectronics = await Subject.create({
      courseId: bcaCourse._id,
      semester: 1,
      name: 'Digital Electronics',
      slug: 'digital-electronics'
    });

    console.log('Docs initialized for: Subjects.');

    // 5. Populate Questions linked to C Programming
    await Question.create([
      {
        subjectId: cProgSubject._id, // Links question directly to C Programming
        questionText: "Who is the father of C language?",
        options: ["Steve Jobs", "James Gosling", "Dennis Ritchie", "Rasmus Lerdorf"],
        correctAnswerIndex: 2,
        explanation: "Dennis Ritchie created the C programming language at Bell Labs in 1972."
      },
      {
        subjectId: cProgSubject._id,
        questionText: "Which of the following is a correct format identifier for a character in C?",
        options: ["%d", "%f", "%c", "%s"],
        correctAnswerIndex: 2,
        explanation: "%c is used as a format specifier to display or read a character variable."
      },
      {
        subjectId: cProgSubject._id,
        questionText: "What is the size of an int data type in C (typically on a 32-bit system)?",
        options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
        correctAnswerIndex: 1,
        explanation: "On a standard 32-bit or 64-bit system, an int typically occupies 4 bytes."
      },
      {
        subjectId: cProgSubject._id,
        questionText: "Which keyword is used to prevent a variable from being modified?",
        options: ["static", "volatile", "const", "extern"],
        correctAnswerIndex: 2,
        explanation: "The 'const' keyword defines a constant variable whose value cannot be changed after initialization."
      }
    ]);

    console.log('🎉 Database successfully seeded with baseline sample data.');
    
    // 6. Close out process cleanly
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding process failed with error:', error.message);
    process.exit(1);
  }
};

seedData();