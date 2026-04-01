import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  title: "FileForge",
  description: "Convert documents and images easily",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}