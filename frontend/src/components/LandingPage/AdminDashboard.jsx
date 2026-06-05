import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [token, setToken] = useState('');
  
  // Data States
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectQuestions, setSubjectQuestions] = useState([]); 
  const [status, setStatus] = useState({ type: '', message: '' });

  // Form States
  const [courseForm, setCourseForm] = useState({ name: '', fullName: '', icon: '💻', semestersCount: '6' });
  const [subjectForm, setSubjectForm] = useState({ courseId: '', semester: '1', name: '', slug: '' });
  
  // Question Form & Edit State
  const [qForm, setQForm] = useState({ subjectId: '', questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswerIndex: '0', explanation: '' });
  const [editingQId, setEditingQId] = useState(null);

  // ── PDF & URL AUTO-GEN STATES ──
  const [pdfFile, setPdfFile] = useState(null);
  const [webUrl, setWebUrl] = useState(''); // NEW: State for URL input
  const [targetSubjectId, setTargetSubjectId] = useState('');
  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('nextbyte_admin_token');
    if (!savedToken) {
      navigate('/admin/login');
      return;
    }
    setToken(savedToken);
    loadInitialData();
  }, [navigate]);

  const loadInitialData = async () => {
    try {
      const cRes = await fetch('http://localhost:5000/api/courses');
      if (cRes.ok) {
        const cData = await cRes.json();
        setCourses(cData || []);
        
        if (cData && cData.length > 0) {
          setSubjectForm(prev => ({ ...prev, courseId: cData[0]._id }));
          fetchSubjectsForQuestions(cData[0].name);
        }
      }
    } catch (err) { console.error('DB connect error:', err); }
  };

  const fetchSubjectsForQuestions = async (courseName) => {
    try {
      const sRes = await fetch(`http://localhost:5000/api/courses/${courseName}/subjects`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setSubjects(sData || []);
        if (sData && sData.length > 0) {
          setQForm(prev => ({ ...prev, subjectId: sData[0]._id }));
          setTargetSubjectId(sData[0]._id);
          fetchQuestionsList(sData[0]._id);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchQuestionsList = async (subId) => {
    const savedToken = localStorage.getItem('nextbyte_admin_token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/questions/${subId}`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      });
      if (res.ok) setSubjectQuestions(await res.json());
    } catch (err) { console.error("Could not fetch questions list."); }
  };

  const showStatus = (type, message) => {
    setStatus({ type, message });
    setTimeout(() => setStatus({ type: '', message: '' }), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('nextbyte_admin_token');
    navigate('/admin/login');
  };

  // ── COURSE & SUBJECT CRUD ──
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(courseForm)
      });
      if (res.ok) {
        showStatus('success', '🎉 Course created successfully!');
        setCourseForm({ name: '', fullName: '', icon: '💻', semestersCount: '6' });
        loadInitialData();
      }
    } catch (err) { showStatus('error', 'Network failure.'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("⚠️ WARNING: Deletes course AND ALL nested data. Proceed?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/courses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { showStatus('success', '🗑️ Course wiped clean.'); loadInitialData(); }
    } catch (err) { showStatus('error', 'Deletion aborted.'); }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(subjectForm)
      });
      if (res.ok) {
        showStatus('success', '📚 Subject registered.');
        const targetCourse = courses.find(c => c._id === subjectForm.courseId);
        setSubjectForm({ ...subjectForm, name: '', slug: '' });
        if (targetCourse) fetchSubjectsForQuestions(targetCourse.name);
      }
    } catch (err) { showStatus('error', 'Subject creation failure.'); }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Delete this subject and its questions?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/subjects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { showStatus('success', '🗑️ Subject removed.'); loadInitialData(); }
    } catch (err) { showStatus('error', 'Network issue.'); }
  };

  // ── QUESTION CRUD HANDLERS ──
  const handleSubjectDropdownChange = (e) => {
    const newSubId = e.target.value;
    setQForm({ ...qForm, subjectId: newSubId });
    setTargetSubjectId(newSubId);
    fetchQuestionsList(newSubId);
    cancelEdit(); 
  };

  const handleAddOrUpdateQuestion = async (e) => {
    e.preventDefault();
    const payload = {
      subjectId: qForm.subjectId,
      questionText: qForm.questionText,
      options: [qForm.optionA, qForm.optionB, qForm.optionC, qForm.optionD],
      correctAnswerIndex: parseInt(qForm.correctAnswerIndex),
      explanation: qForm.explanation
    };

    const url = editingQId ? `http://localhost:5000/api/admin/questions/${editingQId}` : 'http://localhost:5000/api/admin/questions';
    const method = editingQId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showStatus('success', editingQId ? '✅ MCQ Updated!' : '✍️ MCQ securely appended.');
        fetchQuestionsList(qForm.subjectId);
        cancelEdit();
      }
    } catch (err) { showStatus('error', 'Question commit failed.'); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete this question permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showStatus('success', '🗑️ Question deleted.');
        fetchQuestionsList(qForm.subjectId);
      }
    } catch (err) { showStatus('error', 'Deletion failed.'); }
  };

  const initiateEdit = (q) => {
    setEditingQId(q._id);
    setQForm({
      subjectId: q.subjectId,
      questionText: q.questionText,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctAnswerIndex: q.correctAnswerIndex.toString(),
      explanation: q.explanation
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelEdit = () => {
    setEditingQId(null);
    setQForm({ ...qForm, questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswerIndex: '0', explanation: '' });
  };

  // ── AUTO GENERATION HANDLERS ──
  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile || !targetSubjectId) return showStatus('error', 'Please select a subject and upload a PDF.');
    
    setIsGenerating(true);
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);

    try {
      const res = await fetch('http://localhost:5000/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }, 
        body: formData 
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedMCQs(data);
        showStatus('success', '✨ AI successfully extracted questions from PDF!');
      } else {
        showStatus('error', data.message || 'AI processing failed.');
      }
    } catch (err) {
      showStatus('error', 'Failed to communicate with AI model.');
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Handler for fetching from URL
  // ── FIX: URL FETCH HANDLER ──
  const handleUrlFetch = async (e) => {
    e.preventDefault();
    if (!webUrl || !targetSubjectId) return showStatus('error', 'Please select a subject and enter a URL.');
    
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/generate-url', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', // Yeh URL ke liye sahi hai
          'Authorization': `Bearer ${token}` 
        }, 
        body: JSON.stringify({ url: webUrl }) 
      });

      // Agar error hai toh status read karo
      if (!res.ok) {
        const errData = await res.text(); // Error text read karo
        throw new Error(errData);
      }

      const data = await res.json();
      setGeneratedMCQs(data);
      showStatus('success', '🌐 AI successfully extracted questions!');
    } catch (err) {
      console.error(err);
      showStatus('error', 'Extraction failed. Check terminal log.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBulkQuestions = async () => {
    const finalPayload = generatedMCQs.map(q => ({ ...q, subjectId: targetSubjectId }));

    try {
      const res = await fetch('http://localhost:5000/api/admin/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ questions: finalPayload })
      });
      if (res.ok) {
        showStatus('success', '🚀 All AI questions saved to database!');
        setGeneratedMCQs([]); 
        setPdfFile(null); 
        setWebUrl(''); // Reset URL state
        fetchQuestionsList(targetSubjectId); 
      }
    } catch (err) {
      showStatus('error', 'Failed to bulk save questions.');
    }
  };

  // Helper to change tabs and clear pending generated items
  const switchTab = (tabId) => {
    setActiveTab(tabId);
    setGeneratedMCQs([]); // Clear out any unsaved AI generated questions
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans min-h-[80vh]">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Management Hub</h1>
          <p className="text-slate-500 text-sm">Create, query, delete, or auto-generate production entities.</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition self-start sm:self-center">
          Exit Dashboard
        </button>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-semibold tracking-wide shadow-sm animate-fadeIn ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {status.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-56 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-slate-200 shrink-0">
          {[
            { id: 'courses', label: '🗂️ Courses' },
            { id: 'subjects', label: '📚 Subjects' },
            { id: 'questions', label: '✍️ Manage MCQs' },
            { id: 'pdf-gen', label: '📄 PDF Auto-Gen' },
            { id: 'url-gen', label: '🌐 URL Auto-Gen' } // NEW TAB ADDED
          ].map(tab => (
            <button key={tab.id} onClick={() => switchTab(tab.id)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-150 ${activeTab === tab.id ? 'bg-green-100 text-green-800 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-w-0">
          
          {/* TAB 1: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-8 animate-fadeIn">
              <form onSubmit={handleAddCourse} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Initialize New Course Degree</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" required placeholder="Course Name (e.g., BCA)" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                  <input type="text" required placeholder="Full Name (e.g., Bachelor of...)" value={courseForm.fullName} onChange={e => setCourseForm({...courseForm, fullName: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                  <input type="text" required placeholder="Emoji Icon (e.g., 💻)" value={courseForm.icon} onChange={e => setCourseForm({...courseForm, icon: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                  <input type="number" required placeholder="Semesters Count" value={courseForm.semestersCount} onChange={e => setCourseForm({...courseForm, semestersCount: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-[#00A63E] text-white text-sm font-bold rounded-xl hover:bg-green-700 transition">Save Course</button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Existing Active Channels</div>
                <div className="divide-y divide-slate-100">
                  {courses.map(c => (
                    <div key={c._id} className="px-6 py-4 flex items-center justify-between text-sm">
                      <div><span className="mr-2 text-base">{c.icon}</span><strong>{c.name}</strong> — {c.fullName}</div>
                      <button onClick={() => handleDeleteCourse(c._id)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg transition">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="space-y-8 animate-fadeIn">
               <form onSubmit={handleAddSubject} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Map Subject Under Course Branch</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select required value={subjectForm.courseId} onChange={e => {
                    setSubjectForm({...subjectForm, courseId: e.target.value});
                    const target = courses.find(c => c._id === e.target.value);
                    if (target) fetchSubjectsForQuestions(target.name);
                  }} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50">
                    <option value="" disabled>Select a Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <input type="number" required placeholder="Target Semester" value={subjectForm.semester} onChange={e => setSubjectForm({...subjectForm, semester: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                  <input type="text" required placeholder="Subject Name" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                  <input type="text" required placeholder="URL Slug (e.g., c-prog)" value={subjectForm.slug} onChange={e => setSubjectForm({...subjectForm, slug: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
                </div>
                <button type="submit" disabled={courses.length === 0} className="px-5 py-2.5 bg-[#00A63E] text-white text-sm font-bold rounded-xl hover:bg-green-700 transition disabled:bg-slate-300">Save Subject</button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50">Current Mapped Subjects</div>
                <div className="divide-y divide-slate-100">
                  {subjects.map(s => (
                    <div key={s._id} className="px-6 py-4 flex items-center justify-between text-sm">
                      <div><strong>{s.name}</strong> <span className="text-xs bg-slate-100 px-2 py-0.5 rounded ml-2">Sem {s.semester}</span></div>
                      <button onClick={() => handleDeleteSubject(s._id)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg transition">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Question logic unchanged, omitted for brevity but standard from your code */}
              <form onSubmit={handleAddOrUpdateQuestion} className={`border p-6 rounded-2xl shadow-sm space-y-4 transition-colors ${editingQId ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-bold ${editingQId ? 'text-amber-800' : 'text-slate-800'}`}>
                    {editingQId ? '📝 Edit Existing MCQ' : '➕ Add New MCQ Entry'}
                  </h3>
                  {editingQId && (
                    <button type="button" onClick={cancelEdit} className="text-xs font-bold text-slate-500 hover:text-slate-800 transition">Cancel Edit ✖</button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Subject Filter</label>
                  <select required value={qForm.subjectId} onChange={handleSubjectDropdownChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50">
                    <option value="" disabled>Select a Subject</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} (Sem {s.semester})</option>)}
                  </select>
                </div>
                
                <textarea required rows="2" placeholder="Question Text" value={qForm.questionText} onChange={e => setQForm({...qForm, questionText: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                
                <div className="grid grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => {
                    const key = `option${letter}`;
                    return <input key={letter} type="text" required placeholder={`Option ${letter}`} value={qForm[key]} onChange={e => setQForm({...qForm, [key]: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />;
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Correct Answer Index</label>
                    <select value={qForm.correctAnswerIndex} onChange={e => setQForm({...qForm, correctAnswerIndex: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50">
                      <option value="0">Option A</option><option value="1">Option B</option><option value="2">Option C</option><option value="3">Option D</option>
                    </select>
                  </div>
                </div>
                <textarea required rows="2" placeholder="Explanation Text" value={qForm.explanation} onChange={e => setQForm({...qForm, explanation: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-green-500" />
                
                <button type="submit" disabled={subjects.length === 0} className={`px-6 py-3 text-white text-sm font-bold rounded-xl transition shadow-sm disabled:bg-slate-300 w-full sm:w-auto ${editingQId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#00A63E] hover:bg-green-700'}`}>
                  {editingQId ? 'Save Changes' : 'Save MCQ Entry'}
                </button>
              </form>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800 bg-slate-50/50 flex justify-between items-center">
                  <span>Questions Bank ({subjectQuestions.length})</span>
                </div>
                
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {subjectQuestions.length > 0 ? subjectQuestions.map((q, index) => (
                    <div key={q._id} className="p-6 hover:bg-slate-50 transition">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-2">Q{index + 1}. {q.questionText}</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 mb-2">
                            {q.options.map((opt, i) => (
                              <span key={i} className={i === q.correctAnswerIndex ? 'text-green-600 font-bold' : ''}>
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => initiateEdit(q)} className="text-amber-600 hover:text-amber-800 font-bold text-xs bg-amber-50 px-3 py-1.5 rounded-lg transition text-center">Edit</button>
                          <button onClick={() => handleDeleteQuestion(q._id)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded-lg transition text-center">Delete</button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-10 text-center text-slate-400 text-sm italic">
                      No questions found for the currently selected subject.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PDF AUTO GENERATOR */}
          {activeTab === 'pdf-gen' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">AI PDF MCQ Extraction</h3>
                <p className="text-sm text-slate-500 mb-6">Upload a study PDF. The AI will read it and automatically generate MCQs for you to review.</p>
                
                <form onSubmit={handlePdfUpload} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Target Subject Group</label>
                    <select required value={targetSubjectId} onChange={handleSubjectDropdownChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50">
                      <option value="" disabled>Select a Subject</option>
                      {subjects.map(s => <option key={s._id} value={s._id}>{s.name} (Sem {s.semester})</option>)}
                    </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">Upload PDF Document</label>
                     <input type="file" accept=".pdf" required onChange={e => setPdfFile(e.target.files[0])} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00A63E] file:text-white hover:file:bg-green-700 transition" />
                  </div>

                  <button type="submit" disabled={isGenerating || subjects.length === 0} className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:bg-slate-300 w-full flex items-center justify-center gap-2">
                    {isGenerating ? <span className="animate-pulse">🧠 AI is analyzing PDF...</span> : '✨ Generate Questions'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* NEW TAB 5: URL AUTO GENERATOR */}
          {activeTab === 'url-gen' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Web URL MCQ Extraction</h3>
                <p className="text-sm text-slate-500 mb-6">Paste an article or website link. AI will scrape the page and pull relevant MCQs from the content.</p>
                
                <form onSubmit={handleUrlFetch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Target Subject Group</label>
                    <select required value={targetSubjectId} onChange={handleSubjectDropdownChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50">
                      <option value="" disabled>Select a Subject</option>
                      {subjects.map(s => <option key={s._id} value={s._id}>{s.name} (Sem {s.semester})</option>)}
                    </select>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1">Paste Website URL</label>
                     <input type="url" required placeholder="https://example.com/article" value={webUrl} onChange={e => setWebUrl(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-indigo-500" />
                  </div>

                  <button type="submit" disabled={isGenerating || subjects.length === 0} className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:bg-slate-300 w-full flex items-center justify-center gap-2">
                    {isGenerating ? <span className="animate-pulse">🧠 AI is scraping URL...</span> : '🌐 Extract from Link'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── SHARED PREVIEW SECTION FOR BOTH PDF AND URL TABS ── */}
          {/* By placing this outside the strict activeTab blocks but inside the flex-1 container, or rendering it conditionally based on state, we prevent duplication! */}
          {generatedMCQs.length > 0 && (activeTab === 'pdf-gen' || activeTab === 'url-gen') && (
            <div className="bg-white border border-indigo-200 p-6 rounded-2xl shadow-sm mt-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-indigo-800">Review Generated MCQs</h3>
                 <button onClick={saveBulkQuestions} className="px-5 py-2 bg-[#00A63E] hover:bg-green-700 text-white font-bold rounded-lg text-sm shadow-sm transition">
                   Save All to Database
                 </button>
              </div>

              <div className="space-y-4">
                {generatedMCQs.map((q, index) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">Q{index + 1}. {q.questionText}</h4>
                    <ul className="text-xs text-slate-600 space-y-1 mb-2">
                      {q.options.map((opt, i) => (
                        <li key={i} className={i === q.correctAnswerIndex ? 'font-bold text-green-600' : ''}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500 italic border-t pt-2 border-slate-200"><strong>Exp:</strong> {q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}