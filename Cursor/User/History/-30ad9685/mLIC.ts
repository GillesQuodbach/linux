import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId?: string;
  setAuth: (authed: boolean, userId?: string) => Promise<void>;
  hydrate: () => Promise<void>;
  signOut: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  async setAuth(authed, userId) {
    set({ isAuthenticated: authed, userId });
    if (authed && userId) {
      await SecureStore.setItemAsync('uid', userId);
    } else {
      await SecureStore.deleteItemAsync('uid');
    }
  },
  async hydrate() {
    const uid = await SecureStore.getItemAsync('uid');
    set({ isAuthenticated: !!uid, userId: uid ?? undefined, isLoading: false });
  },
  async signOut() {
    await SecureStore.deleteItemAsync('uid');
    set({ isAuthenticated: false, userId: undefined });
  },
  async loginAsDemo() {
    const demoId = 'demo-user';
    await SecureStore.setItemAsync('uid', demoId);
    set({ isAuthenticated: true, userId: demoId, isLoading: false });
  },
}));




