import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Standard Imports 
import QuestionDetail from './components/Pages/QuestionDetail';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";

// Lazy Load Imports
const LandingPage = lazy(() => import("./components/LandingPage/LandingPage"));
const AdminLogin = lazy(() => import('./components/LandingPage/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/LandingPage/AdminDashboard'));
const SubjectsPage = lazy(() => import("./components/SubjectsPage"));
const McqPage = lazy(() => import("./components/LandingPage/McqPage"));
const CoursesPage = lazy(() => import("./components/LandingPage/CoursesPage"));
const AdminUpload = lazy(() => import('./components/AdminUpload'));
const AboutUs = lazy(() => import("./components/AboutUs"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

// 404 Component 
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
        <ScrollToTop />
        <Navbar />

        {/* Suspense provides a fallback UI while lazy components load */}
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
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<AdminUpload />} />

            {/* Consumer Routes */}
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:courseName" element={<SubjectsPage />} />
            <Route path="/course/:courseName/:subjectName" element={<McqPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            {/* Wildcard Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Footer />
      </Router>
    </HelmetProvider>
  );
};

export default App;