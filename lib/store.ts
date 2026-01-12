/**
 * Global state management using Zustand
 */

import { create } from "zustand";
import type { AppState, TimeFrame } from "./types";

export const useAppStore = create<AppState>((set) => ({
  selectedTimeframe: "4H",
  setSelectedTimeframe: (timeframe: TimeFrame) =>
    set({ selectedTimeframe: timeframe }),
  lastUpdate: Date.now(),
  setLastUpdate: (timestamp: number) => set({ lastUpdate: timestamp }),
  isRefreshing: false,
  setIsRefreshing: (isRefreshing: boolean) => set({ isRefreshing }),
}));
