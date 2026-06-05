import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />

      {/* Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-200/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 India's Learning Platform
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Learn Smarter with
              <span className="block text-green-600">
                NextByte
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Semester-wise Notes, MCQs, Coding Questions,
              Previous Year Papers and Career Roadmaps
              for BCA, B.Tech, MCA and more.
            </p>

           

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                to="/courses"
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-7
                  py-3.5
                  rounded-xl
                  font-semibold
                "
              >
                Explore Courses
              </Link>

              <Link
                to="/mcqs"
                className="
                  border
                  border-slate-300
                  hover:border-green-500
                  px-7
                  py-3.5
                  rounded-xl
                  font-semibold
                "
              >
                Practice MCQs
              </Link>

            </div>

            {/* Trust */}
            <div className="flex items-center gap-8 mt-10">

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  5K+
                </h3>
                <p className="text-sm text-slate-500">
                  Students
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  1200+
                </h3>
                <p className="text-sm text-slate-500">
                  MCQs
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  50+
                </h3>
                <p className="text-sm text-slate-500">
                  Subjects
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
                <div className="text-4xl">📚</div>
                <h3 className="mt-4 font-bold text-xl">
                  Notes
                </h3>
                <p className="text-slate-500 mt-2">
                  Easy-to-understand study material.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
                <div className="text-4xl">🧠</div>
                <h3 className="mt-4 font-bold text-xl">
                  MCQs
                </h3>
                <p className="text-slate-500 mt-2">
                  Topic-wise practice questions.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
                <div className="text-4xl">💻</div>
                <h3 className="mt-4 font-bold text-xl">
                  Coding
                </h3>
                <p className="text-slate-500 mt-2">
                  Programming practice & projects.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-100">
                <div className="text-4xl">🚀</div>
                <h3 className="mt-4 font-bold text-xl">
                  Roadmaps
                </h3>
                <p className="text-slate-500 mt-2">
                  Career guidance & placement prep.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

