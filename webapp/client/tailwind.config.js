/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // This is loaded dynamically, therefore not detected by tailwind
  safelist: [
    {
      pattern: /bg-/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};
