import React from 'react';

export default function AdBanner({ format = "horizontal" }) {
  // Define standard sizes that match AdSense dimensions
  const styles = {
    horizontal: "w-full max-w-[728px] h-[90px] mx-auto mb-8", // Standard Leaderboard Ad
    rectangle: "w-full max-w-[336px] h-[280px] mx-auto my-8", // Standard Large Rectangle Ad
  };

  return (
    <div className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 overflow-hidden ${styles[format]}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        Advertisement
      </span>
      <span className="text-xs font-medium px-4 text-center">
        AdSense Placeholder space ({format})
      </span>
    </div>
  );
}