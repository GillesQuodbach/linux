import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInCalendarDays } from 'date-fns';

export type ProgressState = {
  startDateISO: string; // sobriety start
  dailySpend: number; // how much money per day previously spent on alcohol
  hydrate: () => Promise<void>;
  setStartDate: (iso: string) => Promise<void>;
  setDailySpend: (amount: number) => Promise<void>;
  daysSober: () => number;
  moneySaved: () => number;
};

const START_KEY = 'progress.startDateISO';
const SPEND_KEY = 'progress.dailySpend';

export const useProgress = create<ProgressState>((set, get) => ({
  startDateISO: new Date().toISOString(),
  dailySpend: 15,
  async hydrate() {
    const [sIso, spend] = await Promise.all([
      AsyncStorage.getItem(START_KEY),
      AsyncStorage.getItem(SPEND_KEY),
    ]);
    set({
      startDateISO: sIso ?? new Date().toISOString(),
      dailySpend: spend ? Number(spend) : 15,
    });
  },
  async setStartDate(iso) {
    await AsyncStorage.setItem(START_KEY, iso);
    set({ startDateISO: iso });
  },
  async setDailySpend(amount) {
    await AsyncStorage.setItem(SPEND_KEY, String(amount));
    set({ dailySpend: amount });
  },
  daysSober() {
    const start = new Date(get().startDateISO);
    return Math.max(0, differenceInCalendarDays(new Date(), start));
  },
  moneySaved() {
    return get().daysSober() * get().dailySpend;
  },
}));


