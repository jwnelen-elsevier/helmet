import NavigationBar from "@/app/_components/navBar";
import FooterComponent from "@/app/_components/footer";
import "@/styles/globals.css";
import { StatusProvider } from "@/providers/status";

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
