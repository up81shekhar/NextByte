import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// 1. Standard Imports for components that appear on EVERY page
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 2. Lazy Load Imports (These only download when the user clicks them!)
// Note: Ensure your file paths match your folder structure perfectly.
const LandingPage = lazy(() => import("./components/LandingPage/LandingPage"));
// const SubjectsPage = lazy(() => import('./components/LandingPage/SubjectsPage'));
const SubjectsPage = lazy(() => import("./components/SubjectsPage"));
const McqPage = lazy(() => import("./components/LandingPage/McqPage"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

// 3. A quick inline 404 Component (You can move this to its own file later if you want)
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-bold text-[#00A63E] mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-slate-800 mb-2">
      Page Not Found
    </h2>
    <p className="text-slate-500 mb-6">
      The course or subject you are looking for doesn't exist.
    </p>
    <a
      href="/"
      className="bg-[#00A63E] hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition"
    >
      Go Back Home
    </a>
  </div>
);

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />

        {/* 4. Suspense provides a fallback UI (loading state) while the lazy components download */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-10 h-10 border-4 border-green-200 border-t-[#00A63E] rounded-full animate-spin mb-4"></div>
              <div className="text-sm font-bold text-slate-400 animate-pulse">
                Loading NextByte...
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/course/:courseName" element={<SubjectsPage />} />
            <Route
              path="/course/:courseName/:subjectName"
              element={<McqPage />}
            />

            {/* 5. The Wildcard Route (*): If the URL doesn't match the 3 above, show 404 */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>

        <Footer />
      </Router>
    </HelmetProvider>
  );
};

export default App;
