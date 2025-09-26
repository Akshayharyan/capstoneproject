// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center gap-3">
            <svg className="h-7 w-7 text-purple-600" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"></path>
            </svg>
            <span className="font-bold text-gray-800">SkillQuest</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
            <a className="text-sm text-gray-600 hover:text-purple-600" href="#">About</a>
            <a className="text-sm text-gray-600 hover:text-purple-600" href="#">Contact</a>
            <a className="text-sm text-gray-600 hover:text-purple-600" href="#">Privacy Policy</a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">© 2024 SkillQuest. All rights reserved.</p>
      </div>
    </footer>
  );
}
