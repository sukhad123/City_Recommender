"use client";

import { useState } from "react";
import ContactFormModal from "./ContactFormModal";
import SocialButtons from "./SocialButtons"

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="w-full border-t border-default-200 dark:border-default-100 py-4 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          © {new Date().getFullYear()} City Recommender. All rights reserved.
        </span>

        <div className="flex space-x-6 mt-2 sm:mt-0 items-center">
     
          <span className="hover:underline cursor-pointer text-gray-500">
            About
          </span>

          <button
            onClick={() => setContactOpen(true)}
            className="hover:underline cursor-pointer text-gray-500"
          >
            Contact
          </button>

   
         <SocialButtons/>
        </div>
      </div>
      <ContactFormModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </footer>
  );
}
