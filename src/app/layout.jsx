import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  metadataBase: new URL("https://fileforge-six.vercel.app"),

  title: {
    default: "FileForge - Online File Converter",
    template: "%s | FileForge",
  },

  description:
    "FileForge lets you convert PDF, DOCX, and images quickly and securely. Fast, reliable, and easy to use online file converter.",

  keywords: [
    "file converter",
    "pdf to docx",
    "docx to pdf",
    "image converter",
    "online file converter",
    "free file tools",
    "compression",
    "image compression",
  ],

  authors: [{ name: "FileForge" }],

  openGraph: {
    title: "FileForge - Online File Converter",
    description:
      "Convert documents and images instantly with FileForge. Fast and secure online tool.",
    url: "https://fileforge-six.vercel.app",
    siteName: "FileForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

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