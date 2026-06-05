import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Helmet>
        <title>About Us | NextByte</title>
        <meta name="description" content="Learn more about NextByte, the premier platform for free BCA, MCA, and BBA MCQ preparation and placement guides." />
      </Helmet>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">About NextByte</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
          <p>
            Welcome to <strong className="text-[#00A63E]">NextByte</strong>. Our mission is simple: to make high-quality technical education and interview preparation completely free and accessible to every student.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Story</h2>
          <p>
            Founded in Aligarh, Uttar Pradesh, NextByte was built by Shekhar out of a firsthand understanding of the challenges software engineering and computer application students face. While preparing for rigorous campus recruitment drives and university exams, finding structured, accurate, and free multiple-choice questions was a constant struggle. NextByte was created to bridge that gap.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comprehensive MCQ banks for BCA, MCA, and BBA curriculums.</li>
            <li>In-depth explanations to understand the "why" behind every answer.</li>
            <li>Subject-wise roadmaps aligned with real university semesters.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Vision</h2>
          <p>
            We believe that financial constraints should never stand in the way of a student's dream of landing an Associate Software Developer role or passing their semester exams with flying colors. By keeping our platform free and ad-supported, we ensure that knowledge remains open to all.
          </p>
        </div>
      </div>
    </div>
  );
}