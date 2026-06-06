import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "./Hero";
import CoursesPage from "./CoursesPage";
import { API_BASE_URL } from '../Config';


export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asynchronous API fetch handler
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        if (!response.ok) {
          throw new Error("Failed to retrieve course directories.");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 font-bold text-slate-400">
        Loading courses...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            🚀 Start Learning
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-5">
            Popular Courses 
          </h2>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Learn semester-wise subjects, MCQs, notes and roadmaps designed for
            university students.
          </p>
        </div>

        {/* Courses Preview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course._id}
              className="
          bg-white
          rounded-3xl
          p-7
          border
          border-green-100
          hover:border-green-400
          hover:shadow-xl
          transition-all
          duration-300
        "
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl">{course.icon || "💻"}</div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {course.name}
                  </h3>

                  <p className="text-slate-500 text-sm">{course.fullName}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {course.semestersCount} Semesters
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  MCQs
                </span>
              </div>

              <Link
                to={`/course/${course.name.toLowerCase()}`}
                className="
            block
            text-center
            mt-6
            bg-green-600
            hover:bg-green-700
            text-white
            font-semibold
            py-3
            rounded-2xl
            transition
          "
              >
                Explore Course →
              </Link>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="
        inline-flex
        items-center
        gap-2
        bg-slate-900
        text-white
        px-8
        py-4
        rounded-2xl
        font-semibold
        hover:bg-black
        transition
      "
          >
            View All Courses →
          </Link>
        </div>
      </div>

          <section className="bg-white py-20">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      <div className="text-center">
        <h3 className="text-4xl font-bold text-green-600">
          {courses.length}+
        </h3>
        <p className="text-slate-500 mt-2">
          Courses
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-4xl font-bold text-green-600">
          50+
        </h3>
        <p className="text-slate-500 mt-2">
          Subjects
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-4xl font-bold text-green-600">
          5000+
        </h3>
        <p className="text-slate-500 mt-2">
          MCQs
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-4xl font-bold text-green-600">
          24/7
        </h3>
        <p className="text-slate-500 mt-2">
          Learning
        </p>
      </div>

    </div>
  </div>
</section>

<section className="py-20 bg-green-50">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-center text-4xl font-bold mb-14">
      Why Students Choose NextByte
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-white rounded-3xl p-8">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="font-bold text-xl">
          Semester Wise Learning
        </h3>
        <p className="text-slate-600 mt-3">
          Organized according to your university syllabus.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8">
        <div className="text-5xl mb-4">🧠</div>
        <h3 className="font-bold text-xl">
          Practice MCQs
        </h3>
        <p className="text-slate-600 mt-3">
          Prepare for exams with topic-wise questions.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8">
        <div className="text-5xl mb-4">🚀</div>
        <h3 className="font-bold text-xl">
          Career Roadmaps
        </h3>
        <p className="text-slate-600 mt-3">
          Learn skills required for placements and jobs.
        </p>
      </div>

    </div>
  </div>
</section>

    </div>
  );
}
