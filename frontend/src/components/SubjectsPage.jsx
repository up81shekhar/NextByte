import React from "react";
import { useParams, Link } from "react-router-dom"; // FIXED: Added Link here
import AdBanner from "./LandingPage/AdBanner";

// Temporary Mock Data representing our backend
const MOCK_DATA = {
  bca: [
    {
      id: 1,
      sem: 1,
      slug: "c-programming",
      name: "C Programming",
      questions: [
        {
          id: 1,
          question: "Who is the father of C language?",
          options: [
            "Steve Jobs",
            "James Gosling",
            "Dennis Ritchie",
            "Rasmus Lerdorf",
          ],
          answer: 2, // Index of correct option (Dennis Ritchie)
          explanation:
            "Dennis Ritchie created the C programming language at Bell Labs in 1972.",
        },
        {
          id: 2,
          question:
            "Which of the following is a correct format identifier for a character in C?",
          options: ["%d", "%f", "%c", "%s"],
          answer: 2,
          explanation:
            "%c is used as a format specifier to display or read a character variable.",
        },
      ],
    },
    
    {
      id: 2,
      sem: 1,
      slug: "digital-electronics",
      name: "Digital Electronics",
      questions: [],
    },
  ],
  
  mca: [],
  bba: [],
};

export default function SubjectsPage() {
  // Grab the course name from the URL (e.g., 'bca')
  const { courseName } = useParams();

  // Find the subjects for this specific course from our fake data
  // Fallback to empty array if courseName doesn't exist in MOCK_DATA
  const subjectsList = courseName ? MOCK_DATA[courseName.toLowerCase()] || [] : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold uppercase text-gray-800">
        {courseName} Subjects
      </h1>
      <p className="text-gray-500 mt-2">
        Choose a subject to start practicing mock MCQs.
      </p>
      <AdBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {subjectsList.length > 0 ? (
          subjectsList.map((subject) => (
            <div
              key={subject.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center"
            >
              <div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  Semester {subject.sem}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">
                  {subject.name}
                </h3>
              </div>
              
              {/* FIXED: Replaced standard comment with JSX comment syntax */}
              <Link
                to={`/course/${courseName}/${subject.slug}`}
                className="bg-[#00A63E] hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Explore MCQs
              </Link>
            </div>
          ))
        ) : (
          <p className="text-red-500">No subjects found for this course.</p>
        )}
      </div>
      <AdBanner />

    </div>
  );
}