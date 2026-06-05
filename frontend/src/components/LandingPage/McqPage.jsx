import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from './AdBanner'; // 1. Import your new Ad Component

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
          options: ["Steve Jobs", "James Gosling", "Dennis Ritchie", "Rasmus Lerdorf"],
          answer: 2,
          explanation: "Dennis Ritchie created the C programming language at Bell Labs in 1972."
        },
        {
          id: 2,
          question: "Which of the following is a correct format identifier for a character in C?",
          options: ["%d", "%f", "%c", "%s"],
          answer: 2,
          explanation: "%c is used as a format specifier to display or read a character variable."
        },
        {
          id: 3,
          question: "What is the size of an int data type in C (typically on a 32-bit system)?",
          options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"],
          answer: 1,
          explanation: "On a standard 32-bit or 64-bit system, an int typically occupies 4 bytes."
        },
        {
          id: 4,
          question: "Which keyword is used to prevent a variable from being modified?",
          options: ["static", "volatile", "const", "extern"],
          answer: 2,
          explanation: "The 'const' keyword defines a constant variable whose value cannot be changed after initialization."
        }
      ]
    }
  ],
  mca: [],
  bba: []
};

export default function McqPage() {
  const { courseName, subjectName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10; 

  const courseData = courseName ? MOCK_DATA[courseName.toLowerCase()] || [] : [];
  const subjectData = courseData.find(sub => sub.slug === subjectName);

  if (!subjectData) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Subject not found.</p>
        <Link to="/" className="text-emerald-600 underline mt-4 inline-block">Go Home</Link>
      </div>
    );
  }

  const totalQuestions = subjectData.questions.length;
  const indexOfLastQ = currentPage * questionsPerPage;
  const indexOfFirstQ = indexOfLastQ - questionsPerPage;
  const currentQuestions = subjectData.questions.slice(indexOfFirstQ, indexOfLastQ);
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      <Helmet>
        <title>{subjectData.name} MCQs - Practice for {courseName?.toUpperCase()} | NextByte</title>
        <meta name="description" content={`Practice free ${subjectData.name} multiple choice questions (MCQs) for your ${courseName?.toUpperCase()} exams.`} />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">
        <Link to="/" className="hover:text-emerald-600">Home</Link> /{' '}
        <Link to={`/course/${courseName}`} className="hover:text-emerald-600">{courseName}</Link> /{' '}
        <span className="text-slate-600">{subjectData.name}</span>
      </div>

      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          {subjectData.name} MCQs
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-md">
            Semester {subjectData.sem}
          </span>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md">
            {totalQuestions} Questions Available
          </span>
        </div>
      </div>

      {/* 2. Top Banner Ad Placement */}
      <AdBanner format="horizontal" />

      {/* MCQ Render List with Inline Ads */}
      <div className="space-y-6">
        {currentQuestions.length > 0 ? (
          currentQuestions.map((q, index) => (
            <React.Fragment key={q.id}>
              <McqCard number={indexOfFirstQ + index + 1} qData={q} />
              
              {/* 3. Inject an inline Rectangle Ad after every 3rd question */}
              {(index + 1) % 3 === 0 && (
                 <AdBanner format="rectangle" />
              )}
            </React.Fragment>
          ))
        ) : (
          <p className="text-slate-500 italic text-center py-10">No practice questions uploaded for this subject yet.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              currentPage === 1 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-[#00A63E] text-white hover:bg-green-700'
            }`}
          >
            &larr; Previous Page
          </button>
          
          <span className="text-sm font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              currentPage === totalPages 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-[#00A63E] text-white hover:bg-green-700'
            }`}
          >
            Next Page &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-component for individual question interaction
function McqCard({ number, qData }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6 transition-all duration-200">
      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
        Q{number}. {qData.question}
      </h3>

      <div className="grid grid-cols-1 gap-2.5">
        {qData.options.map((option, index) => {
          let cardStyle = "border-slate-200 hover:bg-slate-50";
          if (selectedOption !== null) {
            if (index === qData.answer) {
              cardStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-medium";
            } else if (index === selectedOption) {
              cardStyle = "border-red-400 bg-red-50/40 text-red-800";
            }
          }

          return (
            <button
              key={index}
              disabled={selectedOption !== null}
              onClick={() => {
                setSelectedOption(index);
                setShowExplanation(true);
              }}
              className={`w-full text-left px-4 py-3 border rounded-xl text-sm transition-all duration-150 ${cardStyle}`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm animate-fadeIn">
          <p className="text-emerald-700 font-bold mb-1">
            ✓ Correct Answer: Option {String.fromCharCode(64 + qData.answer + 1)} ({qData.options[qData.answer]})
          </p>
          <p className="text-slate-600 leading-relaxed mt-2">
            <strong className="text-slate-700">Explanation:</strong> {qData.explanation}
          </p>
        </div>
      )}
    </div>
  );
}