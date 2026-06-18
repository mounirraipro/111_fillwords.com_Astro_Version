import type { APIRoute } from "astro";
import { siteConfig } from "@/data/siteConfig";

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? siteConfig.siteUrl;
  const sitemap = new URL("/sitemap.xml", origin).href;

  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin/",
      "Disallow: /api/",
      `Sitemap: ${sitemap}`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
};
