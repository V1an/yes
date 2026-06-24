export type GameId = "pedantix" | "cemantix";

export interface GameConfig {
  id: GameId;
  name: string;
  domain: string;
  emoji: string;
  description: string;
  // Mirrors the game's own localStorage key prefix (its `o.storePrefix`):
  // pedantix uses prefix "p" -> "p/", cemantix uses no prefix -> "".
  // We use it to pre-seed the "readRules" flag so the rules dialog doesn't
  // auto-open with a broken fetch on first load.
  storePrefix: string;
}

export const GAMES: Record<GameId, GameConfig> = {
  pedantix: {
    id: "pedantix",
    name: "Pédantix",
    domain: "pedantix.certitudes.org",
    emoji: "📰",
    description: "Devinez l'article Wikipédia mot par mot",
    storePrefix: "p/",
  },
  cemantix: {
    id: "cemantix",
    name: "Cemantix",
    domain: "cemantix.certitudes.org",
    emoji: "🧠",
    description: "Devinez le mot mystère par proximité sémantique",
    storePrefix: "",
  },
};

export function isGameId(value: string): value is GameId {
  return value === "pedantix" || value === "cemantix";
}
