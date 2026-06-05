import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 font-sans">
      <Helmet>
        <title>Privacy Policy | NextByte</title>
      </Helmet>

      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p><em>Last updated: June 2026</em></p>
        
        <p>
          At NextByte, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by NextByte and how we use it.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8">1. Information We Collect</h2>
        <p>
          We automatically collect certain information when you visit, use, or navigate the platform. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, and referring URLs.
        </p>

        {/* THIS IS THE CRITICAL ADSENSE CLAUSE */}
        <h2 className="text-xl font-bold text-slate-800 mt-8">2. Google AdSense and DoubleClick Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. 
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" className="text-[#00A63E] hover:underline" target="_blank" rel="noreferrer">Ads Settings</a>.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8">3. Log Files</h2>
        <p>
          NextByte follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8">4. Contact Us</h2>
        <p>
          If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong>up81.shekhar@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}