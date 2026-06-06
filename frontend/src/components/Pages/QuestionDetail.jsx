import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../Config';
import AdBanner from '../LandingPage/AdBanner';

export default function QuestionDetail() {
  const { id } = useParams(); 
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/questions/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuestion(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching question:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-slate-500">
        <h2 className="text-2xl font-bold mb-2">Question Not Found</h2>
        <Link to="/" className="text-indigo-600 underline">Return to Home</Link>
      </div>
    );
  }

  // SEO Description Logic (Max 160 chars)
  const seoDescription = question.explanation 
    ? question.explanation.substring(0, 150) + "..." 
    : `Practice this MCQ on ${question.subjectId?.name || 'Computer Science'} and check your knowledge.`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      
      {/* 🚀 1. SEO META TAGS (PROGRAMMATIC SEO) 🚀 */}
      <Helmet>
        <title>{question.questionText} - NextByte MCQs</title>
        <meta name="description" content={seoDescription} />
      </Helmet>

      {/* 🚀 2. TOP AD BANNER 🚀 */}
      <AdBanner format="horizontal" />

      {/* 3. MAIN CONTENT */}
      <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            MCQ Practice
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-snug">
          Q. {question.questionText}
        </h1>

        <div className="space-y-3 mb-8">
          {question.options.map((opt, index) => (
            <div 
              key={index} 
              className={`p-4 border rounded-xl text-sm md:text-base transition-all ${
                showAnswer && index === question.correctAnswerIndex 
                  ? 'bg-green-50 border-green-500 font-bold text-green-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span className="mr-3 font-bold text-slate-400">
                {String.fromCharCode(65 + index)}.
              </span>
              {opt}
            </div>
          ))}
        </div>

        {/* User Interaction Trigger */}
        <button 
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full md:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition shadow-sm"
        >
          {showAnswer ? 'Hide Answer' : '👀 View Correct Answer & Explanation'}
        </button>

        {/* Answer Reveal Section */}
        {showAnswer && (
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl animate-fadeIn">
            <h3 className="font-bold text-amber-900 mb-2 text-sm uppercase tracking-wider">Explanation:</h3>
            <p className="text-amber-800 text-sm md:text-base leading-relaxed">
              {question.explanation || "No detailed explanation provided for this question."}
            </p>
          </div>
        )}
      </div>

      {/* 🚀 4. BOTTOM AD BANNER 🚀 */}
      <AdBanner format="rectangle" />
      
    </div>
  );
}