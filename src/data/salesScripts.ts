import { FURNITURE_SCRIPT, isFurnitureNiche } from "@/data/furnitureSalesScript";
import { isVehicleStoreNiche, VEHICLE_STORE_SCRIPT } from "@/data/vehicleStoreSalesScript";
import type { SalesScriptDefinition } from "@/types/salesScript";

const SCRIPTS: Record<string, SalesScriptDefinition> = {
  [VEHICLE_STORE_SCRIPT.key]: VEHICLE_STORE_SCRIPT,
  [FURNITURE_SCRIPT.key]: FURNITURE_SCRIPT,
};

export function getSalesScript(scriptKey: string) {
  return SCRIPTS[scriptKey] ?? VEHICLE_STORE_SCRIPT;
}

export function getSalesScriptForNiche(niche?: string | null) {
  if (isVehicleStoreNiche(niche)) return VEHICLE_STORE_SCRIPT;
  if (isFurnitureNiche(niche)) return FURNITURE_SCRIPT;
  return null;
}
