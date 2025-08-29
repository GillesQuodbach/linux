import { create } from 'zustand';
import { db } from '../db/connection';
import { nanoid } from 'nanoid';

export type CultureType = 'soil' | 'hydro';

export type Plant = {
  id: string;
  name: string;
  cultureType: CultureType;
  photoUri?: string;
  nextWateringAt?: number | null;
  hydro?: { ph: number; ec: number };
};

export type PlantInput = Omit<Plant, 'id'>;

type State = {
  plants: Plant[];
  loadPlants: () => Promise<void>;
  addPlant: (input: PlantInput) => Promise<void>;
  updatePlant: (id: string, input: PlantInput) => Promise<void>;
  removePlant: (id: string) => Promise<void>;
};

export const usePlantStore = create<State>((set, get) => ({
  plants: [],
  loadPlants: async () => {
    const rows = await db.getAllAsync<any>(`SELECT * FROM plants ORDER BY createdAt DESC`);
    const items: Plant[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      cultureType: r.cultureType,
      photoUri: r.photoUri ?? undefined,
      nextWateringAt: r.nextWateringAt,
      hydro: r.ph != null && r.ec != null ? { ph: r.ph, ec: r.ec } : undefined,
    }));
    set({ plants: items });
  },
  addPlant: async (input) => {
    const id = nanoid();
    await db.runAsync(
      `INSERT INTO plants (id, name, cultureType, photoUri, nextWateringAt, ph, ec, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s','now'))`,
      [id, input.name, input.cultureType, input.photoUri ?? null, input.nextWateringAt ?? null, input.hydro?.ph ?? null, input.hydro?.ec ?? null]
    );
    await get().loadPlants();
  },
  updatePlant: async (id, input) => {
    await db.runAsync(
      `UPDATE plants SET name=?, cultureType=?, photoUri=?, nextWateringAt=?, ph=?, ec=? WHERE id=?`,
      [input.name, input.cultureType, input.photoUri ?? null, input.nextWateringAt ?? null, input.hydro?.ph ?? null, input.hydro?.ec ?? null, id]
    );
    await get().loadPlants();
  },
  removePlant: async (id) => {
    await db.runAsync(`DELETE FROM plants WHERE id=?`, [id]);
    await get().loadPlants();
  },
}));

