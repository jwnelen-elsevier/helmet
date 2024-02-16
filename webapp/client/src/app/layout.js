import NavigationBar from "@/app/_components/navBar";
import FooterComponent from "@/app/_components/footer";
import "@/styles/globals.css";
import { StatusProvider } from "@/providers/status";
import PageNav from "@/app/_components/pageNav";
import { Providers } from "@/providers/nextUI";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StatusProvider>
          <NavigationBar />
          <PageNav />
          {children}
          <FooterComponent />
        </StatusProvider>
      </body>
    </html>
  );
}
