// src/components/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3 mt-5">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Daily Starter App. All rights reserved.</p>
        <div className="flex space-x-4 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/daily-starter" className="hover:underline">Daily Starter</a>
          <a href="/task-analysis" className="hover:underline">Task Analysis</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
