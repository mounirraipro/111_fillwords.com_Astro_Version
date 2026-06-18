export type ExternalGame = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  seoOverview: string;
  howToPlay: string;
  strategyGuide: string;
  playerTips: string[];
  category: string;
  thumbnail: string;
  iframeUrl: string;
  accent: string;
  accentClass: string;
};

const playgamaCatalogId = "p_eb5ee739-3023-44bb-875d-81fe60b91666";
const playgamaIframeUrl = (slug: string) => `https://playgama.com/export/game/${slug}?clid=${playgamaCatalogId}`;
const playgamaThumbnail = (slug: string, extension = "webp") => `/game-thumbs/playgama/${slug}.${extension}`;

export const externalGames = [
  {
    slug: "word-search",
    title: "Word Search",
    shortTitle: "Word Search",
    description: "Play Word Search online, a free browser word puzzle where you scan letter grids and find every hidden themed word.",
    seoOverview:
      "Word Search is a natural companion for FillWords players because it uses the same patient scanning rhythm: read the target list, inspect the grid, and confirm hidden words with clean swipes. It is simple enough for a quick break, but longer lists and diagonal words still reward focus, spelling memory, and pattern recognition.",
    howToPlay:
      "Read the word list, then search horizontally, vertically, diagonally, forward, and backward. When you find a full word, drag or swipe across its letters to mark it. Keep going until every word in the list is found.",
    strategyGuide:
      "Start with the longest words and rare letters because they have fewer possible locations. Search rows, columns, and diagonals in a consistent order instead of jumping around the board. If a word starts with a common letter, use its ending or double-letter pattern as the anchor.",
    playerTips: [
      "Use rare letters such as Q, X, Z, and J as anchors.",
      "Scan in one direction at a time before switching.",
      "Find long words before short common words.",
      "Look for endings when first letters appear too often.",
    ],
    category: "Words",
    thumbnail: playgamaThumbnail("word-search"),
    iframeUrl: playgamaIframeUrl("word-search-hidden-words"),
    accent: "#f6b63d",
    accentClass: "accent-gold",
  },
  {
    slug: "word-solitaire",
    title: "Word Solitaire",
    shortTitle: "Word Solitaire",
    description: "Play Word Solitaire online, a free word card puzzle where vocabulary and category logic replace classic suits.",
    seoOverview:
      "Word Solitaire blends calm card pacing with language reasoning. Instead of matching suits, players read words, compare meanings, and place cards into fitting sets. It belongs in the FillWords library because it turns vocabulary into a deliberate puzzle with clean decisions and short rounds.",
    howToPlay:
      "Draw word cards and place each one onto the category or stack where it fits best. Some cards have obvious homes, while flexible words may need to be saved until the board becomes clearer. Complete every required set to clear the level.",
    strategyGuide:
      "Place words with only one strong match first, then hold flexible cards until more categories are visible. Read the whole board before committing a card, because the first plausible association is not always the strongest one.",
    playerTips: [
      "Place obvious associations before flexible words.",
      "Read every category before committing a card.",
      "Use uncertain words as clues for missing groups.",
      "Slow down near the end to avoid blocking the final set.",
    ],
    category: "Words",
    thumbnail: playgamaThumbnail("word-solitaire"),
    iframeUrl: playgamaIframeUrl("word-solitaire"),
    accent: "#f6b63d",
    accentClass: "accent-gold",
  },
  {
    slug: "sudoku",
    title: "Sudoku",
    shortTitle: "Sudoku",
    description: "Play Sudoku online, a free number logic puzzle where every row, column, and box must contain 1 through 9.",
    seoOverview:
      "Sudoku gives FillWords visitors a pure logic option with no timer pressure. Every number comes from deduction, and every solved cell helps the next one. The result is a thoughtful browser puzzle for players who enjoy careful scanning and clean proof instead of guessing.",
    howToPlay:
      "Select an empty cell and enter a number from 1 to 9. The same number cannot repeat in the current row, column, or 3 by 3 box. Use the given numbers to narrow the options until the full grid is complete.",
    strategyGuide:
      "Start with rows, columns, or boxes that already contain many numbers. Find singles first, then hidden singles where a number can fit in only one place. Use notes when available and avoid guesses that can damage the whole grid.",
    playerTips: [
      "Scan the most complete boxes first.",
      "Use notes for uncertain cells.",
      "Check row, column, and box before confirming.",
      "When stuck, rescan for hidden singles.",
    ],
    category: "Logic",
    thumbnail: playgamaThumbnail("sudoku"),
    iframeUrl: playgamaIframeUrl("sudoku"),
    accent: "#2563eb",
    accentClass: "accent-blue",
  },
  {
    slug: "mahjong-connect",
    title: "Mahjong Connect",
    shortTitle: "Mahjong",
    description: "Play Mahjong Connect online, a free tile puzzle where matching tiles clear only when a valid path connects them.",
    seoOverview:
      "Mahjong Connect is a tile-matching puzzle built around scanning, spacing, and sequence. It suits FillWords players who like finding patterns in dense boards, because each removed pair changes the routes available to the next match.",
    howToPlay:
      "Find two identical tiles that can be connected by a clear route. The route usually cannot pass through other tiles and can only turn a limited number of times. Remove accessible pairs until the board is empty.",
    strategyGuide:
      "Start from the edges because outside pairs usually open the most space. When several matches are available, choose the pair that creates new paths rather than the one that is merely easiest to see.",
    playerTips: [
      "Scan the border before searching the center.",
      "Prioritize pairs that open new corridors.",
      "Rescan after every clear.",
      "Save obvious pairs if another move unlocks more space.",
    ],
    category: "Tiles",
    thumbnail: playgamaThumbnail("mahjong-connect"),
    iframeUrl: playgamaIframeUrl("mahjong-lines"),
    accent: "#20b8d8",
    accentClass: "accent-sky",
  },
  {
    slug: "bubble-shooter",
    title: "Bubble Shooter",
    shortTitle: "Bubbles",
    description: "Play Bubble Shooter online, a free arcade puzzle where you aim, match colors, and clear bubble clusters.",
    seoOverview:
      "Bubble Shooter adds a faster visual puzzle to the FillWords game library. It still rewards planning and board reading, but the challenge shifts to aiming, color setup, and chain reactions.",
    howToPlay:
      "Aim the launcher at bubbles of the same color and shoot to create a matching group, usually three or more. Matched groups pop and disappear. Clear the board or keep playing as long as possible.",
    strategyGuide:
      "Aim for high clusters that can drop several lower bubbles at once. Use wall banks when a direct shot is blocked, and avoid scattering single colors where they cannot connect later.",
    playerTips: [
      "Target hanging clusters for bigger clears.",
      "Use bank shots to reach blocked colors.",
      "Avoid isolated single bubbles.",
      "Plan around the next color when it is shown.",
    ],
    category: "Arcade",
    thumbnail: playgamaThumbnail("bubble-shooter"),
    iframeUrl: playgamaIframeUrl("bubble-shooter-island-quest"),
    accent: "#8b5cf6",
    accentClass: "accent-violet",
  },
  {
    slug: "block-puzzle",
    title: "Block Puzzle",
    shortTitle: "Blocks",
    description: "Play Block Puzzle online, a free browser logic game where you place shapes, clear lines, and keep space open.",
    seoOverview:
      "Block Puzzle is a clean spatial logic game about fitting pieces onto a board without trapping yourself. It is a useful break from word grids because the thinking stays deliberate while the puzzle language changes from letters to space.",
    howToPlay:
      "Drag each available block shape onto the grid. Complete a full row or column to clear it and make more room. The game ends when none of the available pieces can fit.",
    strategyGuide:
      "Preserve one large open area instead of creating many small gaps. Place awkward shapes while the board still has flexibility, and choose clears that improve the shape of the remaining space.",
    playerTips: [
      "Keep the center flexible for larger pieces.",
      "Avoid isolated holes that cannot clear soon.",
      "Choose line clears that improve the next move.",
      "Place awkward shapes before space gets tight.",
    ],
    category: "Puzzle",
    thumbnail: playgamaThumbnail("block-puzzle"),
    iframeUrl: playgamaIframeUrl("block-blast-master"),
    accent: "#f97316",
    accentClass: "accent-orange",
  },
  {
    slug: "2048-merge-blocks",
    title: "2048 Merge Blocks",
    shortTitle: "2048",
    description: "Play 2048 Merge Blocks online, a free number puzzle where matching tiles merge into higher values.",
    seoOverview:
      "2048 Merge Blocks turns number matching into a compact planning puzzle. Matching values combine into larger numbers, and each merge changes future space on the board. It fits FillWords players who enjoy readable rules with decisions that grow deeper over time.",
    howToPlay:
      "Select matching number tiles and merge connected groups into a higher value. Reach the required target in level modes or keep merging as long as the board remains playable.",
    strategyGuide:
      "Keep high-value tiles organized near each other. When several merges are possible, choose the one that creates the cleanest next board rather than only the biggest immediate score.",
    playerTips: [
      "Keep high-value tiles close together.",
      "Look for the largest connected group before merging.",
      "Preserve open space around important numbers.",
      "Use power-ups only when the board is nearly blocked.",
    ],
    category: "Numbers",
    thumbnail: playgamaThumbnail("2048-merge-blocks"),
    iframeUrl: playgamaIframeUrl("2048-merge-blocks"),
    accent: "#f97316",
    accentClass: "accent-orange",
  },
  {
    slug: "4-color-card-game",
    title: "4 Color Card Game",
    shortTitle: "4 Color",
    description: "Play 4 Color Card Game online, a quick browser card game where you match colors, numbers, and action cards.",
    seoOverview:
      "4 Color Card Game gives the FillWords library a light card-game option for quick sessions. The rules are familiar, the decisions are immediate, and each round rewards timing special cards instead of using them too early.",
    howToPlay:
      "Play a card that matches the current color or number. If you cannot play, draw a card. Special cards can skip, reverse, force draws, or change the active color depending on the round.",
    strategyGuide:
      "Keep more than one color available whenever possible. Watch which colors opponents avoid, and save flexible action cards for moments when they change the tempo or protect your final turns.",
    playerTips: [
      "Keep a balanced hand across colors.",
      "Do not spend action cards just because they are available.",
      "Notice when opponents hesitate on a color.",
      "Save flexible cards for the final turns when possible.",
    ],
    category: "Cards",
    thumbnail: playgamaThumbnail("4-color-card-game"),
    iframeUrl: playgamaIframeUrl("4-color-card-game"),
    accent: "#ff5e4d",
    accentClass: "accent-coral",
  },
  {
    slug: "solitaire-classic",
    title: "Solitaire Classic",
    shortTitle: "Solitaire",
    description: "Play Solitaire Classic online, a free browser card game collection with familiar solitaire modes.",
    seoOverview:
      "Solitaire Classic gives puzzle players a slower card-game reset. It rewards sequencing, preserving useful moves, and revealing hidden information at the right time. That makes it a strong no-download game for visitors who want calm decisions without a word grid.",
    howToPlay:
      "Choose a solitaire mode, then move cards according to that mode's rules. In Klondike-style play, build descending tableau columns in alternating colors and move completed suits to the foundation.",
    strategyGuide:
      "Prioritize moves that reveal hidden cards or create empty columns. Do not send cards to the foundation automatically if they still help organize the tableau.",
    playerTips: [
      "Reveal face-down cards before low-value foundation moves.",
      "Use empty columns intentionally.",
      "Check the tableau before drawing from the stock.",
      "Keep flexible sequences available until the board opens.",
    ],
    category: "Cards",
    thumbnail: playgamaThumbnail("solitaire-classic"),
    iframeUrl: playgamaIframeUrl("solitaire-"),
    accent: "#23cc88",
    accentClass: "accent-green",
  },
  {
    slug: "jixora-jigsaw-solitaire-puzzle",
    title: "Jixora: Jigsaw Solitaire Puzzle",
    shortTitle: "Jixora",
    description: "Play Jixora online, a relaxing jigsaw solitaire puzzle with artwork, snap-together pieces, and power-ups.",
    seoOverview:
      "Jixora is a visual puzzle for players who like restoring pictures piece by piece. It uses artwork, snap-together fragments, and helpful tools to create a calm challenge that complements FillWords with a different kind of pattern recognition.",
    howToPlay:
      "Drag puzzle pieces with the mouse or your finger and place them near matching neighbors. Correct pieces snap together so larger groups can move as one. Complete the artwork before the timer runs out.",
    strategyGuide:
      "Start with corners, borders, strong color changes, and repeated shapes. Build small reliable groups before moving into the center, and save hints for moments where several pieces look similar.",
    playerTips: [
      "Build from corners and edges first.",
      "Use the preview when similar colors slow you down.",
      "Move confirmed groups together.",
      "Save hints for the final third of hard puzzles.",
    ],
    category: "Jigsaw",
    thumbnail: playgamaThumbnail("jixora-jigsaw-solitaire-puzzle"),
    iframeUrl: playgamaIframeUrl("jixora-jigsaw-solitaire-puzzle"),
    accent: "#ff5e4d",
    accentClass: "accent-coral",
  },
  {
    slug: "solitaire-picture-puzzles",
    title: "Solitaire Picture Puzzles",
    shortTitle: "Picture Puzzles",
    description: "Play Solitaire Picture Puzzles online, a picture-matching puzzle where cards join into a complete image.",
    seoOverview:
      "Solitaire Picture Puzzles turns image solving into a card-style browser puzzle. Players swap picture cards, connect matching regions, and gradually reveal the full scene. It is a calm visual alternative for FillWords players who want a puzzle based on shapes and colors.",
    howToPlay:
      "Select a picture card, drag it to another card, and swap their positions. When adjacent cards belong together, they lock into a valid group. Keep swapping until the full image is restored.",
    strategyGuide:
      "Look for obvious image boundaries such as sky lines, object edges, strong shadows, or repeated colors. Once two cards lock together, treat that group as confirmed and build outward.",
    playerTips: [
      "Find unique details before matching broad backgrounds.",
      "Use locked groups as anchors.",
      "Scan the board after every successful merge.",
      "Solve one visual region at a time on harder levels.",
    ],
    category: "Picture",
    thumbnail: playgamaThumbnail("solitaire-picture-puzzles"),
    iframeUrl: playgamaIframeUrl("solitaire-picture-puzzles"),
    accent: "#23cc88",
    accentClass: "accent-green",
  },
  {
    slug: "jigsaw-solitaire-puzzle",
    title: "Jigsaw Solitaire Puzzle",
    shortTitle: "Jigsaw",
    description: "Play Jigsaw Solitaire Puzzle online, a browser puzzle game with image matching and card-like movement.",
    seoOverview:
      "Jigsaw Solitaire Puzzle is a visual browser game that mixes picture fragments with card-style placement. It rewards recognition, grouping, and careful repositioning, giving FillWords visitors another focused puzzle style.",
    howToPlay:
      "Drag a card or tile to a new position and look for matching patterns on nearby pieces. Correct parts lock together and can usually move as a group. Continue joining groups until the full picture is restored.",
    strategyGuide:
      "Treat every locked pair as useful information. Build groups around strong patterns first, then use those groups to test uncertain nearby pieces. If two sections do not connect, look for a bridge piece.",
    playerTips: [
      "Start with distinct artwork or borders.",
      "Keep correct groups near their likely area.",
      "Do not force pieces if the pattern does not align.",
      "Use image shape as a guide when colors repeat.",
    ],
    category: "Jigsaw",
    thumbnail: playgamaThumbnail("jigsaw-solitaire-puzzle"),
    iframeUrl: playgamaIframeUrl("jigsaw-solitaire-puzzle"),
    accent: "#20b8d8",
    accentClass: "accent-sky",
  },
  {
    slug: "sudoku-block-puzzle",
    title: "Sudoku Block Puzzle",
    shortTitle: "Sudoku Blocks",
    description: "Play Sudoku Block Puzzle online, a free block-placement game that mixes sudoku zones with line clears.",
    seoOverview:
      "Sudoku Block Puzzle combines a 9 by 9 board with shape placement. Instead of filling the grid with numbers, players clear rows, columns, and 3 by 3 boxes. It is a strong spatial puzzle for FillWords visitors who want planning without vocabulary.",
    howToPlay:
      "Drag each block onto the 9 by 9 board. Complete a full row, column, or 3 by 3 square to clear those blocks and score. The game ends when the current shapes no longer fit.",
    strategyGuide:
      "Think of the board as nine smaller zones. Try to clear boxes and lines together when possible, and leave room for both square pieces and narrow pieces.",
    playerTips: [
      "Keep at least one 3 by 3 box close to clearing.",
      "Avoid splitting the board into tiny pockets.",
      "Place large pieces before the grid gets crowded.",
      "Look for moves that clear a row and a box together.",
    ],
    category: "Logic",
    thumbnail: playgamaThumbnail("sudoku-block-puzzle"),
    iframeUrl: playgamaIframeUrl("sudoku-block-puzzle"),
    accent: "#2563eb",
    accentClass: "accent-blue",
  },
  {
    slug: "brain-line-connect",
    title: "Brain Line Connect",
    shortTitle: "Line Connect",
    description: "Play Brain Line Connect online, a free one-line logic puzzle where you connect every dot cleanly.",
    seoOverview:
      "Brain Line Connect is a quiet routing puzzle where every level asks for one continuous path through the required dots. It fits the FillWords library because success comes from scanning the whole board before making the first move.",
    howToPlay:
      "Start on a dot, then drag one continuous line through every required dot. Avoid obstacle lines and blocked areas. If the path touches a forbidden line or misses a dot, restart and try a cleaner route.",
    strategyGuide:
      "Before drawing, identify endpoints, chokepoints, and blocked corridors. Work backward from tight areas because those sections usually have fewer valid exits.",
    playerTips: [
      "Plan the route before drawing.",
      "Solve tight corridors before open areas.",
      "Use obstacles as boundaries for possible paths.",
      "Reverse the starting point when stuck.",
    ],
    category: "Logic",
    thumbnail: playgamaThumbnail("brain-line-connect"),
    iframeUrl: playgamaIframeUrl("brain-line-connect"),
    accent: "#8b5cf6",
    accentClass: "accent-violet",
  },
] satisfies ExternalGame[];

export const getExternalGameBySlug = (slug: string) => externalGames.find((game) => game.slug === slug);
