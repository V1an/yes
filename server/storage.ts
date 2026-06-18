import { gameState, proxyStats, type GameState, type InsertGameState, type ProxyStats, type InsertProxyStats } from "@shared/schema";

export interface IStorage {
  getGameState(sessionId: string): Promise<GameState | undefined>;
  createGameState(state: InsertGameState): Promise<GameState>;
  updateGameState(sessionId: string, updates: Partial<GameState>): Promise<GameState | undefined>;
  logProxyStats(stats: InsertProxyStats): Promise<ProxyStats>;
  getRecentProxyStats(): Promise<ProxyStats[]>;
}

export class MemStorage implements IStorage {
  private gameStates: Map<string, GameState>;
  private proxyStatsStore: ProxyStats[];
  private currentGameId: number;
  private currentStatsId: number;

  constructor() {
    this.gameStates = new Map();
    this.proxyStatsStore = [];
    this.currentGameId = 1;
    this.currentStatsId = 1;
  }

  async getGameState(sessionId: string): Promise<GameState | undefined> {
    return this.gameStates.get(sessionId);
  }

  async createGameState(insertState: InsertGameState): Promise<GameState> {
    const id = this.currentGameId++;
    const state: GameState = {
      ...insertState,
      id,
      startTime: new Date(),
      completedAt: null,
      isCompleted: false,
    };
    this.gameStates.set(state.sessionId, state);
    return state;
  }

  async updateGameState(sessionId: string, updates: Partial<GameState>): Promise<GameState | undefined> {
    const existing = this.gameStates.get(sessionId);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.gameStates.set(sessionId, updated);
    return updated;
  }

  async logProxyStats(insertStats: InsertProxyStats): Promise<ProxyStats> {
    const id = this.currentStatsId++;
    const stats: ProxyStats = {
      ...insertStats,
      id,
      timestamp: new Date(),
    };
    this.proxyStatsStore.push(stats);
    
    // Keep only last 100 entries
    if (this.proxyStatsStore.length > 100) {
      this.proxyStatsStore = this.proxyStatsStore.slice(-100);
    }
    
    return stats;
  }

  async getRecentProxyStats(): Promise<ProxyStats[]> {
    return this.proxyStatsStore.slice(-10);
  }
}

export const storage = new MemStorage();
