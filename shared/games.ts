export type GameId = "pedantix" | "cemantix";

export interface GameConfig {
  id: GameId;
  name: string;
  domain: string;
  emoji: string;
  description: string;
}

export const GAMES: Record<GameId, GameConfig> = {
  pedantix: {
    id: "pedantix",
    name: "Pédantix",
    domain: "pedantix.certitudes.org",
    emoji: "📰",
    description: "Devinez l'article Wikipédia mot par mot",
  },
  cemantix: {
    id: "cemantix",
    name: "Cemantix",
    domain: "cemantix.certitudes.org",
    emoji: "🧠",
    description: "Devinez le mot mystère par proximité sémantique",
  },
};

export function isGameId(value: string): value is GameId {
  return value === "pedantix" || value === "cemantix";
}
