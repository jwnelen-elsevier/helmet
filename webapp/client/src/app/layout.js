import NavigationBar from "@/app/(components)/layout/navBar";
import FooterComponent from "@/app/_components/footer";
import "@/styles/globals.css";
import { StatusProvider } from "@/providers/status";
import PageNav from "@/app/(components)/layout/pageNav";
import { Providers } from "@/providers/nextUI";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StatusProvider>
            <NavigationBar />
            <PageNav />
            {children}
            <FooterComponent />
          </StatusProvider>
        </Providers>
      </body>
    </html>
  );
}
