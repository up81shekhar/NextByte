import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from '../Config';
import AdBanner from "./AdBanner";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();

        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.fullName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredCourses(filtered);
  }, [search, courses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold text-green-600">
          Loading Courses...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="text-center">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            📚 Explore Learning Paths
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-6">
            Choose Your
            <span className="text-green-600"> Course</span>
          </h1>

          <p className="text-slate-600 max-w-2xl mx-auto mt-5 text-lg">
            Learn semester-wise subjects, practice MCQs, and prepare
            for exams with structured roadmaps.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-10">
            <input
              type="text"
              placeholder="Search BCA, B.Tech, MCA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                px-5
                py-4
                rounded-2xl
                border
                border-green-200
                focus:outline-none
                focus:ring-4
                focus:ring-green-100
                shadow-sm
              "
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-green-600">
              {courses.length}+
            </h3>
            <p className="text-slate-500 mt-1">Courses</p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-green-600">50+</h3>
            <p className="text-slate-500 mt-1">Subjects</p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-green-600">5000+</h3>
            <p className="text-slate-500 mt-1">MCQs</p>
          </div>

          <div className="bg-white rounded-3xl p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-green-600">24/7</h3>
            <p className="text-slate-500 mt-1">Learning</p>
          </div>
        </div>
      </section>
      <AdBanner />
      {/* Courses */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">
          Available Courses
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="
                group
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
                <div className="text-5xl">
                  {course.icon || "💻"}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {course.name}
                  </h3>

                  <p className="text-slate-500 text-sm">
                    {course.fullName}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mt-5">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.semestersCount} Semesters
                </span>

                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  MCQs
                </span>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Roadmap
                </span>
              </div>

              <p className="text-slate-600 mt-5 text-sm leading-relaxed">
                Learn semester-wise subjects, topics,
                MCQs and structured preparation paths.
              </p>

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

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-slate-700">
              No Courses Found
            </h3>

            <p className="text-slate-500 mt-2">
              Try searching with another keyword.
            </p>
          </div>
        )}
      </section>
      <AdBanner />
    </div>
  );
}
