import { Plant } from '../store/plants';

export function evaluateHydroAlerts(plant: Plant): string[] {
  if (plant.cultureType !== 'hydro' || !plant.hydro) return [];
  const alerts: string[] = [];
  const { ph, ec } = plant.hydro;
  if (ph < 5.5) alerts.push('pH trop bas (< 5.5)');
  if (ph > 6.5) alerts.push('pH trop élevé (> 6.5)');
  if (ec < 0.8) alerts.push("EC trop bas (< 0.8 mS/cm)");
  if (ec > 2.0) alerts.push("EC trop élevé (> 2.0 mS/cm)");
  return alerts;
}

export function adviceForCulture(type: 'soil' | 'hydro'): string {
  return type === 'hydro'
    ? 'Surveillez pH (5.8-6.2) et EC (0.8-2.0). Changez la solution chaque 1-2 semaines.'
    : "Arrosez quand le sol est sec en surface. Fertilisez 1x/mois en saison de croissance.";
}

