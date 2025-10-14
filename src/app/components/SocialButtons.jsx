"use client";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function SocialButtons() {
  return (
    <div className="flex space-x-4">
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-800"
      >
        <FaGithub size={20} />
      </a>
      <a
        href="https://linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-800"
      >
        <FaLinkedin size={20} />
      </a>
      <a
        href="https://twitter.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-800"
      >
        <FaTwitter size={20} />
      </a>
    </div>
  );
}
