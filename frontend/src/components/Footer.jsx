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