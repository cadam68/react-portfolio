const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");

// installation : npm install sitemap --save-dev
// run : node generate-sitemap.js

// Define your routes here
const routes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/home", changefreq: "weekly", priority: 0.8 },
  { url: "/aboutUs", changefreq: "weekly", priority: 0.6 },
  { url: "/contactUs", changefreq: "weekly", priority: 0.6 },
  // Add more routes as necessary
];

const sitemap = new SitemapStream({ hostname: "https://portfolio.in-line.fr" });

// Function to generate the sitemap
async function generateSitemap() {
  const writeStream = createWriteStream(path.resolve(__dirname, "../public", "sitemap.xml"));

  // Pipe the stream to a write file
  sitemap.pipe(writeStream);

  // Add each route to the sitemap
  routes.forEach((route) => sitemap.write(route));

  // End the stream
  sitemap.end();

  // Wait for the stream to finish and get the sitemap XML
  await streamToPromise(sitemap);

  console.log("Sitemap created successfully!");
}

generateSitemap().catch(console.error);
