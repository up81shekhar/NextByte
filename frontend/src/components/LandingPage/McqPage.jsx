import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from './AdBanner';

export default function McqPage() {
  const { courseName, subjectName } = useParams(); // subjectName acts as the slug here
  
  // State Modules
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ totalQuestions: 0, totalPages: 1, subjectName: '', semester: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const questionsPerPage = 10; 

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/subjects/${subjectName}/questions?page=${currentPage}&limit=${questionsPerPage}`
        );
        if (!response.ok) {
          throw new Error('Failed to load quiz sets.');
        }
        const data = await response.json();
        
        setQuestions(data.questions);
        setMeta({
          totalQuestions: data.totalQuestions,
          totalPages: data.totalPages,
          subjectName: data.subjectName,
          semester: data.semester
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (subjectName) fetchQuestions();
  }, [subjectName, currentPage]);

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Assembling interactive layout metrics...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">Error loading practice pool.</div>;

  // Calculate global question numbers across different pages
  const indexOfFirstQ = (currentPage - 1) * questionsPerPage;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Helmet>
        <title>{meta.subjectName || 'Practice'} MCQs - {courseName?.toUpperCase()} Prep | NextByte</title>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">
        <Link to="/" className="hover:text-emerald-600">Home</Link> /{' '}
        <Link to={`/course/${courseName}`} className="hover:text-emerald-600">{courseName}</Link> /{' '}
        <span className="text-slate-600">{meta.subjectName}</span>
      </div>

      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{meta.subjectName} MCQs</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs font-bold bg-red-50 text-red-500 px-2.5 py-1 rounded-md">
            Semester {meta.semester}
          </span>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md">
            {meta.totalQuestions} Questions Available
          </span>
        </div>
      </div>

      <AdBanner format="horizontal" />

      {/* Questions Stack */}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <React.Fragment key={q._id}>
              <McqCard number={indexOfFirstQ + index + 1} qData={q} />
              {(index + 1) % 3 === 0 && <AdBanner format="rectangle" />}
            </React.Fragment>
          ))
        ) : (
          <p className="text-slate-500 italic text-center py-10">No questions found in this domain cluster.</p>
        )}
      </div>

      {/* Dynamic Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#00A63E] text-white hover:bg-green-700'
            }`}
          >
            &larr; Previous
          </button>
          <span className="text-sm font-medium text-slate-600">Page {currentPage} of {meta.totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.totalPages))}
            disabled={currentPage === meta.totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              currentPage === meta.totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#00A63E] text-white hover:bg-green-700'
            }`}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function McqCard({ number, qData }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset local interactive selections if the question parameters change due to pagination updates
  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
  }, [qData]);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">
        Q{number}. {qData.questionText}
      </h3>

      <div className="grid grid-cols-1 gap-2.5">
        {qData.options.map((option, index) => {
          let cardStyle = "border-slate-200 hover:bg-slate-50";
          if (selectedOption !== null) {
            if (index === qData.correctAnswerIndex) {
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
              className={`w-full text-left px-4 py-3 border rounded-xl text-sm transition ${cardStyle}`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <p className="text-emerald-700 font-bold mb-1">
            ✓ Correct Answer: Option {String.fromCharCode(64 + qData.correctAnswerIndex + 1)} ({qData.options[qData.correctAnswerIndex]})
          </p>
          <p className="text-slate-600 leading-relaxed mt-2">
            <strong className="text-slate-700">Explanation:</strong> {qData.explanation}
          </p>
        </div>
      )}
    </div>
  );
}