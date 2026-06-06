import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from './Config';
import AdBanner from "./LandingPage/AdBanner";

const SEMESTER_ORDINALS = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];


export default function SubjectsPage() {
  const { courseName } = useParams();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/courses/${courseName}/subjects`);
        if (!response.ok) throw new Error('No academic structures found for this track.');
        const data = await response.json();
        setSubjectsList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (courseName) fetchSubjects();
  }, [courseName]);

  const grouped = subjectsList.reduce((acc, subject) => {
    const sem = subject.semester;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(subject);
    return acc;
  }, {});

  const semesters = Object.keys(grouped).sort((a, b) => a - b);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-green-200 border-t-green-600 animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading syllabus...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 gap-2">
      <span className="text-3xl">📭</span>
      <p className="text-slate-500 font-medium">No subjects found for <span className="font-bold text-slate-700">{courseName?.toUpperCase()}</span></p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">

      {/* Header */}
      <div className="mb-6">
        {/* <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1 mb-3">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          NextByte Study Hub
        </div> */}
        <h1 className="text-3xl font-serif font-bold text-slate-800 leading-tight">
          {courseName?.toUpperCase()} <span className="text-[#00A63E]">Subjects</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1.5">
          Choose a subject to start practicing mock MCQs and notes.
        </p>
      </div>

      {/* Ad Slot 1 — Top banner (high visibility, best CTR) */}
      <AdBanner />

      <div className="h-px bg-slate-100 mb-7" />

      {/* Semester Groups */}
      {semesters.map((sem, semIndex) => (
        <div key={sem}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            {SEMESTER_ORDINALS[sem] || `Semester ${sem}`} Semester
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {grouped[sem].map((subject) => (
              <div
                key={subject._id}
                className="group flex items-center justify-between gap-3 bg-white border border-slate-100 hover:border-green-400 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-green-50 group-hover:bg-[#00A63E] flex items-center justify-center text-lg transition-colors duration-200 flex-shrink-0">
                    📚
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 rounded px-1.5 py-0.5 inline-block mb-1">
                      Sem {subject.semester}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 leading-tight truncate">
                      {subject.name}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/course/${courseName}/${subject.slug}`}
                  className="flex-shrink-0 bg-[#00A63E] hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors duration-150"
                >
                  Explore <span className="text-white/80">→</span>
                </Link>
              </div>
            ))}
            <AdBanner />
            <AdBanner />
          </div>

          {/* Ad Slot 2 — Between every 2 semesters (rectangle, better RPM) */}
          {/* {semIndex % 2 === 1 && semIndex !== semesters.length - 1 && (
            <AdBanner />
          )} */}
        </div>
      ))}

    </div>
  );
}