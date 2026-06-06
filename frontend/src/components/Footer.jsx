import AdBanner from "./LandingPage/AdBanner";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-100">
      <div className="max-w-7xl mx-auto px-5 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Next<span className="text-green-600">Byte</span>
                </h2>

                <p className="text-sm text-slate-500">
                  Learn • Practice • Grow
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed max-w-md">
              NextByte helps BCA, B.Tech and MCA students learn
              programming, practice MCQs, follow roadmaps and
              prepare for placements through a structured learning
              experience.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">
              Learning
            </h3>

            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-green-600">
                  Roadmaps
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Courses
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Notes
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Practice
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">
              Resources
            </h3>

            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-green-600">
                  MCQs
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Interview Prep
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Projects
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Placement Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">
              Company
            </h3>

            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-green-600">
                  About
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Contact
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-600">
                  Terms
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}

        <div className="mt-14 bg-green-50 border border-green-100 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">

          {/* <div>
            <h3 className="text-xl font-bold text-slate-800">
              Stay Updated 
            </h3>

            <p className="text-slate-600 mt-2">
              Get placement updates, roadmaps and learning tips.
            </p>
          </div> */}
          <AdBanner />
          <AdBanner />

          {/* <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="
                px-4 py-3
                rounded-xl
                border border-green-200
                outline-none
                focus:ring-2
                focus:ring-green-500
                min-w-[280px]
              "
            />

            <button
              className="
                px-6 py-3
                rounded-xl
                bg-green-600
                hover:bg-green-700
                text-white
                font-semibold
                transition
              "
            >
              Subscribe
            </button>
          </div> */}

        </div>

        {/* Bottom */}

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} NextByte. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-green-600">
              LinkedIn
            </a>

            <a href="#" className="hover:text-green-600">
              GitHub
            </a>

            <a href="#" className="hover:text-green-600">
              Discord
            </a>

            <a href="#" className="hover:text-green-600">
              YouTube
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}