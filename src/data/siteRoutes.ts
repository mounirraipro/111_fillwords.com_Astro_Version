export type SiteRoute = {
  path: string;
  title: string;
  group: "main" | "content" | "legal";
};

export const siteRoutes: SiteRoute[] = [
  { path: "/", title: "Home", group: "main" },
  { path: "/play", title: "Play", group: "main" },
  { path: "/games", title: "Games", group: "main" },
  { path: "/how-to-play", title: "How To Play", group: "content" },
  { path: "/strategy", title: "Strategy", group: "content" },
  { path: "/difficulty-guide", title: "Difficulty Guide", group: "content" },
  { path: "/game-mechanics", title: "Game Mechanics", group: "content" },
  { path: "/blog", title: "Blog", group: "content" },
  { path: "/about", title: "About", group: "content" },
  { path: "/faq", title: "FAQ", group: "content" },
  { path: "/parents", title: "Parents", group: "content" },
  { path: "/contact", title: "Contact", group: "content" },
  { path: "/accessibility", title: "Accessibility", group: "legal" },
  { path: "/privacy-policy", title: "Privacy Policy", group: "legal" },
  { path: "/cookie-policy", title: "Cookie Policy", group: "legal" },
  { path: "/terms", title: "Terms", group: "legal" },
  { path: "/disclaimer", title: "Disclaimer", group: "legal" },
  { path: "/sitemap", title: "Sitemap", group: "main" },
];
