import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function SubjectsPage() {
  const { courseName } = useParams();
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/courses/${courseName}/subjects`);
        if (!response.ok) {
          throw new Error('No academic structures found for this track.');
        }
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

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">Loading syllabus contents...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">No subjects found for {courseName?.toUpperCase()}.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold uppercase text-gray-800">
        {courseName} Subjects
      </h1>
      <p className="text-gray-500 mt-2">Choose a subject to start practicing mock MCQs.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {subjectsList.map((subject) => (
          <div key={subject._id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                Semester {subject.semester}
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">{subject.name}</h3>
            </div>
            <Link
              to={`/course/${courseName}/${subject.slug}`}
              className="bg-[#00A63E] hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              Explore MCQs
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}