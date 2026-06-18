import { siteConfig } from "@/data/siteConfig";

export type ContentSection = {
  heading: string;
  body?: string;
  items?: string[];
};

export type ContentPage = {
  title: string;
  description: string;
  seoTitle?: string;
  keywords?: string[];
  schemaType?: "AboutPage" | "Article" | "Blog" | "ContactPage" | "FAQPage" | "HowTo" | "PrivacyPolicy" | "TermsOfService" | "WebPage";
  eyebrow?: string;
  updated?: string;
  intro: string;
  sections: ContentSection[];
};

const gameName = siteConfig.name;
const contact = siteConfig.contactEmail;
const updated = siteConfig.legalLastUpdated;

export const pageContent = {
  about: {
    title: `About ${gameName}`,
    seoTitle: `About ${gameName} - Free Online Word Puzzle Game`,
    description: `Learn about ${gameName}, the browser word puzzle built around swipe controls, themed grids, and calm vocabulary play.`,
    keywords: ["about FillWords", "word puzzle team", "browser word game"],
    schemaType: "AboutPage",
    intro: "A focused word puzzle site for quick daily play and deeper vocabulary practice.",
    sections: [
      {
        heading: "What FillWords Is",
        body: "FillWords is a browser word puzzle where every board is a compact grid of letters. Players swipe through adjacent letters to find hidden words, clear each cell, and complete themed challenges without installing an app.",
      },
      {
        heading: "Why We Built It",
        body: "The goal is to make a word game that feels immediate, readable, and useful for short breaks. Each round asks for observation, spelling, pattern recognition, and a little patience.",
      },
      {
        heading: "What Makes It Different",
        body: "Instead of typing guesses into a form, FillWords uses direct swiping. Correct words lock into the board, progress stays visible, and the puzzle ends only when the full grid has been resolved.",
      },
      {
        heading: "Key Features",
        items: [
          "Free browser play with no required account.",
          "A static game embed that loads from /game/index.html.",
          "Themed word collections with small and large letter grids.",
          "Mouse and touch controls for desktop, tablet, and phone sessions.",
          "Progress feedback for found words, solve time, and completed levels.",
        ],
      },
      {
        heading: "Contact the FillWords Team",
        body: `Send feedback, accessibility notes, bug reports, or publishing questions through the Contact page or at ${contact}.`,
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    seoTitle: `Accessibility Statement | ${gameName}`,
    description: `${gameName} is committed to readable layouts, clear controls, and ongoing accessibility improvements for the word puzzle experience.`,
    keywords: ["FillWords accessibility", "accessible word game", "web accessibility statement"],
    updated,
    intro: "Our commitment to making FillWords easier to use for as many players as possible.",
    sections: [
      {
        heading: "Our Commitment",
        body: "FillWords aims to provide a clear, responsive, and understandable game website. We review layout, contrast, navigation, and content structure as the site evolves.",
      },
      {
        heading: "Website Measures",
        items: [
          "Semantic page structure for headings, navigation, and article content.",
          "Responsive layouts that support small screens and browser zoom.",
          "Visible focus states and keyboard access for site navigation.",
          "Descriptive link text, labels, and page titles.",
          "Plain language support pages for rules, privacy, and contact information.",
        ],
      },
      {
        heading: "Game Limitations",
        items: [
          "The embedded game currently relies on visual letter-grid interaction.",
          "Swipe gestures may be difficult for some motor-impaired players.",
          "Some animated effects may depend on browser support and user motion settings.",
        ],
      },
      {
        heading: "Feedback",
        body: `If you encounter an accessibility barrier, contact us at ${contact}. We review accessibility feedback and prioritize fixes that improve the core play path.`,
      },
    ],
  },
  blog: {
    title: `${gameName} Blog`,
    seoTitle: `${gameName} Blog - Word Puzzle Guides and Strategy`,
    description: `Read ${gameName} guides about word puzzle strategy, vocabulary practice, focus, family play, and daily puzzle habits.`,
    keywords: ["FillWords blog", "word puzzle articles", "word game strategy"],
    schemaType: "Blog",
    intro: "Guides and practical notes for better word puzzle play.",
    sections: [],
  },
  contact: {
    title: "Contact",
    seoTitle: `Contact ${gameName}`,
    description: `Contact the ${gameName} team for support, feedback, bug reports, accessibility notes, and partnership questions.`,
    keywords: ["contact FillWords", "FillWords support", "word game contact"],
    schemaType: "ContactPage",
    intro: "Send a message about the game, website, or support pages.",
    sections: [
      {
        heading: "Support Email",
        body: `For general support, bug reports, feedback, or accessibility notes, contact ${contact}.`,
      },
      {
        heading: "Helpful Details",
        items: [
          "Tell us which page or game screen you were using.",
          "Include your browser, device type, and whether you were using touch or mouse controls.",
          "Describe what happened and what you expected to happen.",
          "Do not send passwords, payment information, or sensitive personal details.",
        ],
      },
      {
        heading: "Response Window",
        body: "We review messages regularly. Urgent security or accessibility issues are prioritized before general content suggestions.",
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    seoTitle: `Cookie Policy | ${gameName}`,
    description: `Learn how ${gameName} uses cookies, local storage, analytics configuration, and browser storage for the game and website.`,
    keywords: ["FillWords cookies", "cookie policy", "browser storage"],
    updated,
    intro: "This policy explains how cookies and browser storage may be used on FillWords.",
    sections: [
      {
        heading: "Cookies and Similar Storage",
        body: "Cookies are small files or browser records that help websites remember settings, measure traffic, or support embedded services. Browser local storage can also save game preferences or progress on your device.",
      },
      {
        heading: "How FillWords Uses Storage",
        items: [
          "The game may use local storage to remember progress, records, settings, or sound preferences.",
          "Analytics cookies may be used only when analytics IDs are configured for production.",
          "Advertising or measurement services may set their own cookies if enabled by the site owner.",
        ],
      },
      {
        heading: "Your Choices",
        body: "You can block or delete cookies and local storage through your browser settings. Clearing storage may reset game progress, preferences, or saved scores.",
      },
      {
        heading: "Updates",
        body: "If storage behavior changes, this policy will be updated with the new purpose and affected services.",
      },
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    seoTitle: `Disclaimer | ${gameName}`,
    description: `${gameName} is a free browser game provided for entertainment and general educational value. Read the full website disclaimer.`,
    keywords: ["FillWords disclaimer", "website disclaimer", "word game legal"],
    updated,
    intro: "Important limits for using the game and website content.",
    sections: [
      {
        heading: "Entertainment Use",
        body: "FillWords is provided as a browser-based entertainment product. It may support vocabulary practice and focus, but it is not a medical, educational, or professional assessment tool.",
      },
      {
        heading: "Availability",
        body: "We aim to keep the game available and working across modern browsers, but we do not guarantee uninterrupted uptime, compatibility with every device, or permanent access to every feature.",
      },
      {
        heading: "External Services",
        body: "Analytics, hosting, fonts, and other infrastructure providers may operate under their own terms. We are not responsible for third-party outages or policy changes.",
      },
      {
        heading: "Content Accuracy",
        body: "Guides and articles are written for general information. We update content when practical, but older articles may not reflect every current game detail.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    seoTitle: `${gameName} FAQ - Word Puzzle Help`,
    description: `Find answers about ${gameName} gameplay, devices, controls, progress, safety, and browser support.`,
    keywords: ["FillWords FAQ", "word game questions", "FillWords help"],
    schemaType: "FAQPage",
    intro: "Quick answers before you start playing.",
    sections: [
      {
        heading: "Is FillWords free?",
        body: "Yes. FillWords is free to play in the browser with no required download or account.",
      },
      {
        heading: "How do I play?",
        body: "Choose a puzzle, look at the word theme, then swipe through adjacent letters to spell hidden words. Correct words lock into the grid until every cell is cleared.",
      },
      {
        heading: "Does FillWords work on mobile?",
        body: "Yes. The game supports touch and mouse controls, so it works on phones, tablets, laptops, and desktops with a modern browser.",
      },
      {
        heading: "How many puzzles are included?",
        body: "The current embedded game includes 200 levels across 10 themed collections, with grid sizes that range from quick beginner boards to larger challenge boards.",
      },
      {
        heading: "Is progress saved?",
        body: "The game can store progress and records in your browser. Clearing local storage, using private browsing, or switching devices may reset saved data.",
      },
      {
        heading: "Is FillWords family friendly?",
        body: "Yes. FillWords is built around vocabulary and pattern recognition, with no chat, no user profiles, and no social posting features inside the game.",
      },
    ],
  },
  "how-to-play": {
    title: "How to Play FillWords",
    seoTitle: `How to Play ${gameName} - Complete Word Swipe Guide`,
    description: `Learn how to play ${gameName} step by step. Master swiping through letters, finding hidden words, and clearing every grid.`,
    keywords: ["how to play FillWords", "FillWords guide", "word game tutorial", "word swipe instructions"],
    schemaType: "HowTo",
    intro: "Everything you need to know from your first grid to cleaner solves.",
    sections: [
      {
        heading: "Read the Theme",
        body: "Each puzzle belongs to a topic. Use the title and collection as clues before you start scanning the board.",
      },
      {
        heading: "Swipe Adjacent Letters",
        body: "Drag or swipe through neighboring letters in order. Paths can run horizontally, vertically, diagonally, or bend through the grid when the word path changes direction.",
      },
      {
        heading: "Lock Correct Words",
        body: "When a selected path forms a target word, the game marks it as found. Keep solving until all required words are discovered.",
      },
      {
        heading: "Clear Every Cell",
        body: "A finished puzzle uses the whole board. If letters remain unused, look for shorter words, endings, or paths that turn around corners.",
      },
      {
        heading: "Use Hints Carefully",
        body: "Hints can keep a tough board moving, but scanning first builds stronger pattern recognition. Save hints for moments when several possible paths look equally plausible.",
      },
    ],
  },
  parents: {
    title: "Parents Guide",
    seoTitle: `${gameName} Parents Guide - Family Friendly Word Game`,
    description: `A practical guide for parents about ${gameName}, safe browser play, vocabulary practice, and healthy puzzle sessions.`,
    keywords: ["FillWords for kids", "safe word game", "family friendly word puzzles", "educational word game"],
    intro: "What families should know about the game and its learning value.",
    sections: [
      {
        heading: "Family Friendly Play",
        body: "FillWords is centered on spelling, vocabulary, and visual scanning. The game has no chat, no player profiles, and no social feed.",
      },
      {
        heading: "Learning Value",
        items: [
          "Players practice spelling and word recognition.",
          "The grid format supports visual scanning and attention.",
          "Themed boards can introduce vocabulary by topic.",
          "Short rounds make it easier to set clear play limits.",
        ],
      },
      {
        heading: "Healthy Session Tips",
        items: [
          "Start with a short session and stop after a completed board.",
          "Use harder grids as shared puzzles rather than solo frustration.",
          "Encourage players to say words aloud when they find them.",
          "Balance screen play with reading, writing, and offline activities.",
        ],
      },
      {
        heading: "Privacy Notes",
        body: "FillWords does not require registration to play. Browser storage may save progress locally on the device, and production analytics may be used if configured.",
      },
    ],
  },
  strategy: {
    title: "FillWords Strategy Guide",
    seoTitle: `${gameName} Strategy Guide - Find Words Faster`,
    description: `Improve at ${gameName} with practical scanning, vocabulary, and pathfinding strategies for word swipe grids.`,
    keywords: ["FillWords strategy", "word puzzle tips", "word swipe strategy", "find words faster"],
    schemaType: "Article",
    intro: "Better solves come from a repeatable scan pattern, not random swiping.",
    sections: [
      {
        heading: "Scan for Short Words First",
        body: "Short words are easier to confirm and remove from the board. Clearing them exposes longer paths and reduces visual noise.",
      },
      {
        heading: "Use Common Letter Patterns",
        body: "Look for familiar starts and endings such as RE, UN, ING, ER, ED, TION, and LY. Pattern fragments often reveal the direction of a hidden word.",
      },
      {
        heading: "Work From Corners and Edges",
        body: "Edge cells have fewer possible neighbors, so they are useful starting points. If a rare letter sits near a corner, test that area early.",
      },
      {
        heading: "Trace Before You Commit",
        body: "Before releasing a swipe, check whether the path can continue cleanly through adjacent letters. A valid-looking start can fail if the final letters are boxed in.",
      },
      {
        heading: "Reset Your Eyes",
        body: "If you get stuck, stop swiping for a few seconds and scan the board by rows, columns, and diagonals. A slower pass often reveals words that fast searching missed.",
      },
    ],
  },
  "difficulty-guide": {
    title: "Difficulty Guide",
    seoTitle: `${gameName} Difficulty Guide - Choose the Right Word Grid`,
    description: `Understand ${gameName} difficulty, from small beginner grids to larger themed boards with longer words and denser paths.`,
    keywords: ["FillWords difficulty", "word puzzle levels", "choose word puzzle difficulty"],
    intro: "Difficulty depends on grid size, word length, topic familiarity, and how much a path bends.",
    sections: [
      {
        heading: "Easy Boards",
        body: "Smaller grids with common words are best for learning the controls. Focus on clean swipes and spotting obvious patterns.",
      },
      {
        heading: "Medium Boards",
        body: "Medium boards introduce longer words and more possible paths. Start with the most familiar topic words, then work into the remaining spaces.",
      },
      {
        heading: "Hard Boards",
        body: "Hard boards reward a systematic scan. Track rare letters, likely endings, and words that may bend through the center of the grid.",
      },
      {
        heading: "Master Boards",
        body: "Master boards are larger and less forgiving. Use every confirmed word as a boundary that narrows the remaining path options.",
      },
    ],
  },
  "game-mechanics": {
    title: "Game Mechanics",
    seoTitle: `${gameName} Game Mechanics - Swipes, Grids, and Progress`,
    description: `Learn how ${gameName} works, including letter grids, word paths, validation, hints, records, and local progress.`,
    keywords: ["FillWords mechanics", "word grid game", "word swipe rules", "letter path puzzle"],
    intro: "The core loop is simple: find a word path, swipe it, lock it, and keep clearing the board.",
    sections: [
      {
        heading: "Letter Grids",
        body: "Every puzzle creates a grid of letters sized for that level. The words are hidden as connected paths that can move through neighboring cells.",
      },
      {
        heading: "Word Validation",
        body: "The game checks the swiped sequence against the target word list for the current puzzle. Correct selections are marked found and remain visible as progress.",
      },
      {
        heading: "Progress and Records",
        body: "The game can track completed levels, words found, streaks, solve time, mistakes, hints, and best records in browser storage.",
      },
      {
        heading: "Input Model",
        body: "FillWords is designed for direct pointer play. Mouse drag and touch swipe both follow the same pathfinding model.",
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    seoTitle: `Privacy Policy | ${gameName}`,
    description: `Read the ${gameName} Privacy Policy for information about browser storage, analytics, contact messages, and data handling.`,
    keywords: ["FillWords privacy policy", "word game privacy", "data protection"],
    schemaType: "PrivacyPolicy",
    updated,
    intro: "We keep the site simple and avoid account-based play.",
    sections: [
      {
        heading: "Information You Provide",
        body: `If you contact us at ${contact}, we receive the information you choose to send, such as your email address, message, device notes, or bug report details.`,
      },
      {
        heading: "Browser Storage",
        body: "The game may store progress, records, preferences, and settings locally in your browser. This data stays on the device unless your browser syncs it through its own services.",
      },
      {
        heading: "Analytics",
        body: "Production builds may use analytics tools when measurement IDs are configured. Analytics help us understand page usage, performance, and technical issues.",
      },
      {
        heading: "Children",
        body: "FillWords does not require accounts or knowingly collect personal information from children. Parents can contact us if they believe a child has sent personal information.",
      },
      {
        heading: "Your Choices",
        body: "You can clear cookies and local storage in your browser. You can also avoid sending optional contact messages.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    seoTitle: `Terms of Service | ${gameName}`,
    description: `Read the ${gameName} Terms of Service for rules about using the website, embedded game, and content.`,
    keywords: ["FillWords terms of service", "terms and conditions", "word game terms"],
    schemaType: "TermsOfService",
    updated,
    intro: "These terms govern use of the FillWords website and game.",
    sections: [
      {
        heading: "Acceptance",
        body: "By using FillWords, you agree to these terms and related policies. If you do not agree, do not use the site.",
      },
      {
        heading: "Service Description",
        body: "FillWords provides a free browser word puzzle, informational pages, strategy guides, support pages, and related site content.",
      },
      {
        heading: "Acceptable Use",
        items: [
          "Do not attempt to disrupt, overload, or reverse engineer the service.",
          "Do not use automated scraping or abusive traffic patterns.",
          "Do not copy site content or game files for unauthorized redistribution.",
          "Do not submit unlawful, harmful, or misleading messages through contact channels.",
        ],
      },
      {
        heading: "Intellectual Property",
        body: "The FillWords name, website copy, layout, and game implementation are protected by applicable intellectual property laws unless otherwise stated.",
      },
      {
        heading: "Changes",
        body: "We may update the site, game, or these terms. Continued use after changes means you accept the updated terms.",
      },
    ],
  },
} satisfies Record<string, ContentPage>;

export type PageKey = keyof typeof pageContent;
