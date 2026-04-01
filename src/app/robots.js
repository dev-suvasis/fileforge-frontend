export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://fileforge-six.vercel.app/sitemap.xml",
  };
}