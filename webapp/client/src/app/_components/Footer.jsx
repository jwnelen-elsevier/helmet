"use client";

import { StatusIndicator } from "@/app/_components/ui/Status";

const FooterComponent = () => {
  return (
    <footer className="bg-white w-full sticky footer rounded-lg shadow dark:bg-gray-900">
      <div className="text-sm text-center p-1">
        <StatusIndicator></StatusIndicator>
      </div>
      <div className="w-full max-w-screen-xl mx-auto p-3">
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          © 2024 <a className="hover:underline">Jeroen @ Elsevier</a>
        </span>
      </div>
    </footer>
  );
};

export default FooterComponent;
