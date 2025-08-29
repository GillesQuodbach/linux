import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const LOCAL_KEY = 'journal.entries';

export type JournalEntry = {
  id?: string;
  text: string;
  createdAt: number; // epoch ms
};

export async function saveJournalLocally(entry: Omit<JournalEntry, 'id'>) {
  const currentRaw = (await AsyncStorage.getItem(LOCAL_KEY)) ?? '[]';
  const list: JournalEntry[] = JSON.parse(currentRaw);
  list.unshift({ ...entry });
  await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 100)));
}

export async function getJournalLocal(): Promise<JournalEntry[]> {
  const currentRaw = (await AsyncStorage.getItem(LOCAL_KEY)) ?? '[]';
  return JSON.parse(currentRaw);
}

export async function saveJournalRemote(userId: string, text: string) {
  await addDoc(collection(db, 'users', userId, 'journal'), {
    text,
    createdAt: serverTimestamp(),
  });
}


