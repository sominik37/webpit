import { useState, useCallback } from 'react';

const STORAGE_KEY = 'webpit_daily_usage';
const DAILY_LIMIT = 20;

interface DailyUsage {
  date: string; // ISO date string YYYY-MM-DD
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readUsage(): DailyUsage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed: DailyUsage = JSON.parse(raw);
    // Reset if it's a new day
    if (parsed.date !== getTodayKey()) {
      return { date: getTodayKey(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function writeUsage(usage: DailyUsage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function useFileLimit() {
  const [usage, setUsage] = useState<DailyUsage>(readUsage);

  const filesUsedToday = usage.count;
  const remaining = Math.max(0, DAILY_LIMIT - filesUsedToday);
  const canProcess = filesUsedToday < DAILY_LIMIT;

  /**
   * Attempt to consume `count` slots. Returns the number of files
   * that were actually allowed (may be less than requested if near limit).
   */
  const consume = useCallback((count: number): number => {
    const current = readUsage();
    const allowed = Math.min(count, Math.max(0, DAILY_LIMIT - current.count));
    if (allowed > 0) {
      const updated = { date: getTodayKey(), count: current.count + allowed };
      writeUsage(updated);
      setUsage(updated);
    } else {
      // Still sync state in case it was reset externally
      setUsage(current);
    }
    return allowed;
  }, []);

  return {
    filesUsedToday,
    remaining,
    canProcess,
    limit: DAILY_LIMIT,
    consume,
  };
}
