import type { APIRoute } from "astro";
import { articles } from "@/data/articles";
import { externalGames } from "@/data/externalGames";
import { seoPages, withTrailingSlash } from "@/data/seo";
import { siteConfig } from "@/data/siteConfig";

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const staticContentPages: SitemapEntry[] = [
  { path: "/game/index.html", changeFrequency: "weekly", priority: 0.7 },
];

const articlePages: SitemapEntry[] = articles.map((article) => ({
  path: `/blog/${article.slug}`,
  lastmod: article.dateModified,
  changeFrequency: "monthly",
  priority: 0.7,
}));

const externalGamePages: SitemapEntry[] = externalGames.map((game) => ({
  path: `/games/${game.slug}`,
  changeFrequency: "monthly",
  priority: 0.68,
}));

const normalizePath = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.length > 1 && !normalized.includes(".") ? normalized.replace(/\/+$/, "") : normalized;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toSitemapXml = (entry: SitemapEntry, origin: string, fallbackLastmod: string) => {
  const loc = new URL(withTrailingSlash(entry.path), origin).href;

  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${entry.lastmod ?? fallbackLastmod}</lastmod>`,
    `    <changefreq>${entry.changeFrequency ?? "monthly"}</changefreq>`,
    `    <priority>${(entry.priority ?? 0.5).toFixed(2)}</priority>`,
    "  </url>",
  ].join("\n");
};

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? siteConfig.siteUrl;
  const today = new Date().toISOString().slice(0, 10);
  const entriesByPath = new Map<string, SitemapEntry>();

  [...seoPages.filter((page) => !page.noIndex), ...staticContentPages, ...articlePages, ...externalGamePages].forEach((entry) => {
    const path = normalizePath(entry.path);
    const existing = entriesByPath.get(path);

    entriesByPath.set(path, {
      ...existing,
      ...entry,
      path,
      priority: Math.max(existing?.priority ?? 0, entry.priority ?? 0.5),
    });
  });

  const urls = Array.from(entriesByPath.values())
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((entry) => toSitemapXml(entry, origin, today))
    .join("\n");

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      "</urlset>",
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
};
