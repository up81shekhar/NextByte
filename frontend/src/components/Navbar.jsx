import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; // 1. Import Link and useLocation

// 2. Update hrefs to match real route paths instead of "#"
const navLinks = [
  { label: "Home", href: "/" },
  { label: "BCA", href: "/course/bca" },
  { label: "MCA", href: "/course/mca" }, // Example: defaulting to MCA or a general courses page
  { label: "All Courses", href: "/courses" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 3. Read the current URL directly from React Router
  const location = useLocation(); 

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Changed to Link so clicking it goes to the homepage */}
          <Link to="/" className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Next<span className="text-[#00A63E]">Byte</span>
              </h1>
              <p className="text-xs text-slate-500">
                Learn • Practice • Grow
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              // 4. Automatically check if the current URL matches the link's href
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA (Commented out as in original) */}
          {/* <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition">
              Login
            </button>
            <button className="px-5 py-2 rounded-xl bg-[#00A63E] text-white font-semibold hover:bg-green-700 transition shadow-md">
              Start Learning
            </button>
          </div> */}

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-green-100 bg-white">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMenuOpen(false)} // Close menu when a link is clicked
                  className={`text-left px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}