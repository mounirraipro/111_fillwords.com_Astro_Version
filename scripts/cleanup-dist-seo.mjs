import { access } from "node:fs/promises";
import path from "node:path";

const gameEntry = path.resolve("dist", "game", "index.html");

try {
  await access(gameEntry);
} catch {
  throw new Error(`Missing generated FillWords game entry: ${gameEntry}`);
}
