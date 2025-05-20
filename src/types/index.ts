export interface PlayerResult {
  player?: string;
  team?: string;
  probability?: number;
  confidence?: number;
  explanation?: string;
  nextGame?: string;
  image?: string;
}

export interface HistoryItem {
  id: number;
  playerName: string;
  result: PlayerResult;
  timestamp: string;
}

export interface SavedData {
  playerName: string;
  result: PlayerResult;
  showResults: boolean;
  lastUpdated: string;
}
