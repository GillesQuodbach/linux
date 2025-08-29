import { create } from 'zustand';
import { db } from '../db/connection';
import { nanoid } from 'nanoid';

export type Fertilizer = {
  id: string;
  plantId: string;
  type: string;
  quantity: number;
  unit: string; // ml, g
  appliedAt: number; // epoch seconds
};

type FertilizerState = {
  forPlant: Record<string, Fertilizer[]>;
  loadForPlant: (plantId: string) => Promise<void>;
  addFertilizer: (input: Omit<Fertilizer, 'id'>) => Promise<void>;
};

export const useFertilizerStore = create<FertilizerState>((set, get) => ({
  forPlant: {},
  loadForPlant: async (plantId) => {
    const rows = await db.getAllAsync<any>(`SELECT * FROM fertilizers WHERE plantId=? ORDER BY appliedAt DESC`, [plantId]);
    const list: Fertilizer[] = rows.map((r) => ({ id: r.id, plantId: r.plantId, type: r.type, quantity: r.quantity, unit: r.unit, appliedAt: r.appliedAt }));
    set((s) => ({ forPlant: { ...s.forPlant, [plantId]: list } }));
  },
  addFertilizer: async (input) => {
    const id = nanoid();
    await db.runAsync(
      `INSERT INTO fertilizers (id, plantId, type, quantity, unit, appliedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, input.plantId, input.type, input.quantity, input.unit, input.appliedAt]
    );
    await get().loadForPlant(input.plantId);
  },
}));

