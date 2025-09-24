"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t border-default-200 dark:border-default-100 py-4 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          © {new Date().getFullYear()} City Recommender. All rights reserved.
        </span>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <span className="hover:underline cursor-pointer text-gray-500">
            About
          </span>
          <span className="hover:underline cursor-pointer text-gray-500">
            Contact
          </span>
          <span className="hover:underline cursor-pointer text-gray-500">
            Privacy
          </span>
        </div>
      </div>
    </footer>
  );
}
