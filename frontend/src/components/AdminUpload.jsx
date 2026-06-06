import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../Config';


export default function AdminUpload() {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswerIndex: '0',
    explanation: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Fetch subjects automatically so the Admin can assign the question correctly
  useEffect(() => {
    const fetchAllSubjects = async () => {
      try {
        // We fetch BCA subjects for testing; you can scale this to handle multiple courses easily
        const response = await fetch(`${API_BASE_URL}/api/courses/bca/subjects`);
        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, subjectId: data[0]._id }));
        }
      } catch (err) {
        console.error("Error loading administration fields:", err);
      }
    };
    fetchAllSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Pack the 4 separate option strings into a single array for Mongoose compatibility
    const payload = {
      subjectId: formData.subjectId,
      questionText: formData.questionText,
      options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
      correctAnswerIndex: parseInt(formData.correctAnswerIndex),
      explanation: formData.explanation
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: '🎉 Question saved securely to MongoDB!' });
        // Clear form content except the subject selection
        setFormData({
          ...formData,
          questionText: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          explanation: ''
        });
      } else {
        setStatus({ type: 'error', message: result.message || 'Submission rejected.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network communication failure.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-sans">
      <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Admin Panel</h2>
        <p className="text-slate-500 text-sm mb-6">Upload verified MCQs directly to the cloud production database.</p>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Dropdown Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Select Target Subject</label>
            <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium">
              {subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name} (Sem {sub.semester})</option>
              ))}
            </select>
          </div>

          {/* Question Textarea Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Question Wording</label>
            <textarea name="questionText" required rows="2" value={formData.questionText} onChange={handleChange} placeholder="e.g., Which of the following is an access specifier in Java?" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
          </div>

          {/* Options Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['A', 'B', 'C', 'D'].map((letter, i) => {
              const fieldName = `option${letter}`;
              return (
                <div key={letter}>
                  <label className="block text-xs font-bold text-slate-50 text-slate-600 mb-1.5">Option {letter}</label>
                  <input type="text" name={fieldName} required value={formData[fieldName]} onChange={handleChange} placeholder={`Answer Choice ${letter}`} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                </div>
              );
            })}
          </div>

          {/* Correct Option Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Identified Correct Answer</label>
            <select name="correctAnswerIndex" value={formData.correctAnswerIndex} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700">
              <option value="0">Option A</option>
              <option value="1">Option B</option>
              <option value="2">Option C</option>
              <option value="3">Option D</option>
            </select>
          </div>

          {/* Explanation Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rational Explanation</label>
            <textarea name="explanation" required rows="3" value={formData.explanation} onChange={handleChange} placeholder="Provide deep structural insight into why this option is correct..." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#00A63E] hover:bg-green-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition mt-4 shadow-sm">
            {loading ? 'Processing Registration...' : 'Commit Question to Database'}
          </button>
        </form>
      </div>
    </div>
  );
}