import { describe, expect, it } from "vitest";
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
