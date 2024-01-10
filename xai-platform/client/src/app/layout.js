"use client";
import NavigationBar from "@/components/Navigation";
import "@/styles/globals.css";
import { initFlowbite } from "flowbite";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    initFlowbite();
  });
  return (
    <html lang="en">
      <body>
        <NavigationBar />
        {children}
      </body>
    </html>
  );
}
