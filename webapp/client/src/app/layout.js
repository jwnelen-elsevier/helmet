import Footer from "app/_components/layout/footer";
import NavigationBar from "app/_components/layout/navBar";
import { CertaintyConstantsProvider } from "providers/certaintyConstants";
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
              <CertaintyConstantsProvider>
                <NavigationBar />
                <div className="text-center">{children}</div>
                <Footer />
              </CertaintyConstantsProvider>
            </StatusProvider>
          </ProjectsProvider>
        </Providers>
      </body>
    </html>
  );
}
