import NavigationBar from "@/components/Navigation";
import FooterComponent from "@/components/footer";
import "@/styles/globals.css";
import { SocketProvider } from "@/components/providers/socket-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <NavigationBar />
          {children}
          <FooterComponent />
        </SocketProvider>
      </body>
    </html>
  );
}
