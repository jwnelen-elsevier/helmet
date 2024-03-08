import FooterComponent from "app/_components/layout/Footer";
import PageNav from "app/_components/layout/PageNav";
import NavigationBar from "app/_components/layout/navBar";
import { Providers } from "providers/nextUI";
import { ProjectsProvider } from "providers/project";
import { StatusProvider } from "providers/status";
import "styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ProjectsProvider>
            <StatusProvider>
              <NavigationBar />
              <PageNav />
              <div className="text-center">{children}</div>
              <FooterComponent />
            </StatusProvider>
          </ProjectsProvider>
        </Providers>
      </body>
    </html>
  );
}
