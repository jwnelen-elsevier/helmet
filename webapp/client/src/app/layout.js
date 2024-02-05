import NavigationBar from "@/app/_components/Navigation";
import FooterComponent from "@/app/_components/Footer";
import "@/styles/globals.css";
import { StatusProvider } from "@/providers/status";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StatusProvider>
          <NavigationBar />
          {children}
          <FooterComponent />
        </StatusProvider>
      </body>
    </html>
  );
}
