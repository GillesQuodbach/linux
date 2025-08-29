import { create } from 'zustand';

type SettingsState = {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  notificationsEnabled: true,
  toggleNotifications: () => set({ notificationsEnabled: !get().notificationsEnabled }),
}));

