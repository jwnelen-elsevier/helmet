"use client";

import StatusIndicator from "../ui/status";

const Footer = () => {
  return (
    <footer className="bg-white w-full fixed bottom-0 footer shadow dark:bg-gray-900 flex justify-center">
      <div className="mx-2">
        <span className="text-sm text-gray-500 text-center dark:text-gray-400">
          © 2024 Thesis Project Jeroen @ Elsevier
        </span>
        <span className="text-sm text-gray-500 text-center dark:text-gray-400 mx-2">
          Status: <StatusIndicator></StatusIndicator>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
