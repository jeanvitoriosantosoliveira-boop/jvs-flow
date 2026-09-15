import { describe, expect, it } from "vitest";
import { isFurnitureNiche } from "@/data/furnitureSalesScript";
import { getSalesScriptForNiche } from "@/data/salesScripts";
import { isVehicleStoreNiche } from "@/data/vehicleStoreSalesScript";

describe("isVehicleStoreNiche", () => {
  it.each([
    "Loja de veículo",
    "Loja de veiculos",
    "Lojas de veículo",
    "Lojas de veículos",
  ])("aceita a variação %s", (niche) => {
    expect(isVehicleStoreNiche(niche)).toBe(true);
  });

  it("rejeita nichos sem roteiro compatível", () => {
    expect(isVehicleStoreNiche("Imobiliária")).toBe(false);
  });
});

describe("isFurnitureNiche", () => {
  it.each([
    "Móveis Planejados",
    "Moveis Planejados",
    "Móveis Pré-Moldados",
    "Moveis Pre Moldados",
  ])("aceita a variação %s", (niche) => {
    expect(isFurnitureNiche(niche)).toBe(true);
    expect(getSalesScriptForNiche(niche)?.key).toBe("planned_furniture");
  });

  it("não confunde o roteiro de móveis com o de veículos", () => {
    expect(getSalesScriptForNiche("Lojas de veículos")?.key).toBe("vehicle_store");
  });
});
