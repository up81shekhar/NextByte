import React from "react";
import { Link } from "react-router-dom"; // 1. Import Link

const Courses = ({ name, fullName, icon, semesters, subjects, mcqs, link }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mt-2 bg-white border border-slate-200 rounded-3xl p-5 hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer">
      
      {/* 1. Brand Section */}
      <div className="flex items-center gap-4 ">
        <div className="text-4xl md:text-5xl shrink-0">{icon}</div>
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-tight truncate">
            {name}
          </h3>
          <p className="text-xs md:text-sm text-slate-500 truncate max-w-[200px]">
            {fullName}
          </p>
        </div>
      </div>

      {/* 2. Stats Section */}
      <div className="flex items-center justify-between md:justify-center gap-4 md:gap-8 px-0 md:px-6 py-3 md:py-0 border-y md:border-y-0 md:border-x border-slate-100">
        <StatItem label="Semesters" value={semesters} color="text-red-500" />
        <StatItem label="Subjects" value={subjects} color="text-yellow-600" />
        <StatItem label="MCQs" value={`${mcqs}+`} color="text-green-600" />
      </div>

      {/* 3. Action Section: Changed from <button> to <Link> */}
      <Link
        to={link} // 2. Changed 'href' to 'to'
        className="w-full md:w-auto px-8 h-12 md:h-10 rounded-xl bg-[#00A63E] hover:bg-green-700 text-white font-bold flex items-center justify-center whitespace-nowrap transition"
      >
        Start Learning
      </Link>
    </div>
  );
};

const StatItem = ({ label, value, color }) => (
  <div className="flex flex-col items-center md:items-start">
    <span className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">
      {label}
    </span>
    <span className={`text-base font-bold ${color}`}>{value}</span>
  </div>
);

export default Courses;