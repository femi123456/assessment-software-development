import "./globals.css";
import 'remixicon/fonts/remixicon.css';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "./providers";

export const metadata = {
  title: "Nile Mart | University Marketplace",
  description: "The premium marketplace for university students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
