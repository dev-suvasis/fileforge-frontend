export const dynamic = "force-static";

export default function sitemap() {
  return [
    {
      url: "https://fileforge-six.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://fileforge-six.vercel.app/fileforge",
      lastModified: new Date(),
    },
    {
      url: "https://fileforge-six.vercel.app/imageforge",
      lastModified: new Date(),
    },
  ];
}