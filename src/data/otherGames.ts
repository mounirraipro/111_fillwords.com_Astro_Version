export type SideGame = {
  title: string;
  href: string;
  category: string;
  note: string;
  initials: string;
  thumbnail: string;
};

export const leftSideGames: SideGame[] = [
  {
    title: "Word Search",
    href: "/games/word-search/",
    category: "Words",
    note: "Find hidden words",
    initials: "WS",
    thumbnail: "/game-thumbs/playgama/word-search.webp",
  },
  {
    title: "Word Solitaire",
    href: "/games/word-solitaire/",
    category: "Words",
    note: "Match word sets",
    initials: "WL",
    thumbnail: "/game-thumbs/playgama/word-solitaire.webp",
  },
  {
    title: "Sudoku",
    href: "/games/sudoku/",
    category: "Logic",
    note: "Deduce each number",
    initials: "SU",
    thumbnail: "/game-thumbs/playgama/sudoku.webp",
  },
  {
    title: "Mahjong Connect",
    href: "/games/mahjong-connect/",
    category: "Tiles",
    note: "Clear matching paths",
    initials: "MC",
    thumbnail: "/game-thumbs/playgama/mahjong-connect.webp",
  },
];

export const rightSideGames: SideGame[] = [
  {
    title: "Bubble Shooter",
    href: "/games/bubble-shooter/",
    category: "Arcade",
    note: "Aim and pop colors",
    initials: "BS",
    thumbnail: "/game-thumbs/playgama/bubble-shooter.webp",
  },
  {
    title: "Block Puzzle",
    href: "/games/block-puzzle/",
    category: "Puzzle",
    note: "Place and clear lines",
    initials: "BP",
    thumbnail: "/game-thumbs/playgama/block-puzzle.webp",
  },
  {
    title: "2048 Merge Blocks",
    href: "/games/2048-merge-blocks/",
    category: "Numbers",
    note: "Merge higher values",
    initials: "20",
    thumbnail: "/game-thumbs/playgama/2048-merge-blocks.webp",
  },
  {
    title: "4 Color Card Game",
    href: "/games/4-color-card-game/",
    category: "Cards",
    note: "Match colors fast",
    initials: "4C",
    thumbnail: "/game-thumbs/playgama/4-color-card-game.webp",
  },
];
