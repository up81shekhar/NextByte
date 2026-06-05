import React from 'react';
import AdBanner from './AdBanner';

// Mock data for easy maintenance and scaling
const STATS = [
  { id: 1, value: "150K+", label: "Active Students", description: "Learning globally across 120 countries." },
  { id: 2, value: "4.8/5", label: "Average Rating", description: "Based on 20,000+ reviews on Trustpilot." },
  { id: 3, value: "93%", label: "Success Rate", description: "Students who achieved their career goals." },
];

const LOGOS = [
  { id: 1, name: "Stanford University", icon: "🎓" },
  { id: 2, name: "MIT", icon: "🔬" },
  { id: 3, name: "UC Berkeley", icon: "🐻" },
  { id: 4, name: "Harvard", icon: "🏛️" },
  { id: 5, name: "Oxford", icon: "📚" },
  { id: 6, name: "Cambridge", icon: "🦁" },
];

export default function TrustedByStudents() {
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        
        {/* Header Block */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Trusted by over 150,000+ students worldwide
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            From absolute beginners to advanced professionals, our community spans top-tier universities and Fortune 500 companies.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-16">
          {STATS.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl font-extrabold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-base font-semibold text-slate-800 mb-1">
                {stat.label}
              </div>
              <p className="text-sm text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      <AdBanner />

        {/* Social Proof / Logo Marquee Title */}
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-6">
          Our students come from and go to
        </p>

        {/* Infinite Loop Marquee Container */}
        <div className="relative w-full overflow-x-hidden border-t border-b border-slate-200/60 py-4 mask-gradient">
          {/* Tailwind custom animation class 'animate-marquee' needs to be configured, 
              or inline styles used for standalone functionality */}
          <div className="flex space-x-12 whitespace-nowrap animate-infinite-scroll">
            {/* Double the array to ensure a seamless infinite loop transition */}
            {[...LOGOS, ...LOGOS].map((logo, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 text-slate-500 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <span className="text-2xl">{logo.icon}</span>
                <span className="text-sm font-medium tracking-wide">{logo.name}</span>
              </div>
            ))}
          </div>
      <AdBanner />

        </div>
      </div>
    </section>
  );
}