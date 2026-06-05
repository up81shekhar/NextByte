import { useState } from "react";
import AdBanner from "./AdBanner";

export default function Hero() {
  return (
    <div className="relative mx-4 md:mx-auto max-w-5xl mt-6 rounded-3xl border border-green-200 bg-white p-6 md:p-8 shadow-sm overflow-hidden">
      {/* Top gloss line - Added 'relative' to parent and 'overflow-hidden' so this works properly */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* ── LEFT CONTENT (Text & Bullets) ── */}
        <div className="flex-1 w-full">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-slate-800">
            Learn, Practice &
            <br />
            Crack Exams with
            <span className="block text-green-600">NextByte</span>
          </h1>

          <p className="mt-4 text-slate-600 md:text-lg max-w-lg">
            MCQs, Notes, Coding Questions and Semester-wise Study Resources for
            Students.
          </p>

          {/* Bullets */}
          <ul className="mt-5 space-y-2.5 text-[13px] md:text-sm text-[#5a8a6a] font-medium">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_4px_rgba(74,222,128,0.6)]" />
              Semester-wise Study Resources for Students.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 shadow-[0_0_4px_rgba(74,222,128,0.6)]" />
              <span>
                MCQs, Notes, Coding Questions and more for comprehensive
                learning.
              </span>
            </li>
          </ul>
        </div>

        {/* ── RIGHT CONTENT (Stats Grid) ── */}
        {/* Shows as 3 columns on mobile, but stacks neatly on the right for desktop to save vertical space */}
        <div className="w-full md:w-64 flex-shrink-0 mt-2 md:mt-0">
          <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
            
            <div className="bg-green-50/40 border border-green-100 rounded-xl p-3 md:p-4 text-center flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-green-600">1200+</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">MCQs</p>
            </div>

            <div className="bg-green-50/40 border border-green-100 rounded-xl p-3 md:p-4 text-center flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-green-600">50+</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Subjects</p>
            </div>

            <div className="bg-green-50/40 border border-green-100 rounded-xl p-3 md:p-4 text-center flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-green-600">100+</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Notes</p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}