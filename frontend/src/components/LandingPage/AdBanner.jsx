import React from "react";

export default function AdBanner({ format = "horizontal" }) {
  // Format ke hisaab se dimensions set karo
  const isHorizontal = format === "horizontal";
  const adWidth = isHorizontal ? 728 : 336;
  const adHeight = isHorizontal ? 90 : 280;

  // Har ad ke liye ek isolated HTML document create karo
  const adHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            overflow: hidden; 
            background-color: transparent;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
           atOptions = {
    'key' : '11692545d0db68a2114f7c7697d098c9',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
        </script>
        <script src="https://www.highperformanceformat.com/11692545d0db68a2114f7c7697d098c9/invoke.js"></script>
</body>
    </html>
  `;

  return (
    <div
      className={`w-full flex justify-center mx-auto my-6 ${isHorizontal ? "max-w-[728px]" : "max-w-[336px]"}`}
    >
      {/* <iframe
        title={`ad-${format}`}
        srcDoc={adHTML}
        width={adWidth}
        height={adHeight}
        frameBorder="0"
        scrolling="no"
        className="bg-slate-50 border border-dashed border-slate-300 rounded"
      ></iframe> */}
    </div>
  );
}
