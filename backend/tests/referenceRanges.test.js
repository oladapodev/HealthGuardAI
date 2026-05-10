import { describe, expect, test } from "bun:test";
import { colorCodeLabs, getMenstrualInsights, getReferenceRanges } from "../utils/referenceRanges.js";

describe("reference ranges", () => {
  test("uses gender-aware hemoglobin ranges", () => {
    expect(getReferenceRanges(30, "female").hemoglobin).toEqual({ min: 12, max: 15.5 });
    expect(getReferenceRanges(30, "male").hemoglobin).toEqual({ min: 13.5, max: 17.5 });
  });

  test("color codes labs against configured ranges", () => {
    const ranges = getReferenceRanges(30, "female");
    const labs = colorCodeLabs({ hemoglobin: { value: 11.8, unit: "g/dL" }, glucose: { value: 90 } }, ranges);

    expect(labs.hemoglobin.status).toBe("Yellow");
    expect(labs.glucose.status).toBe("Green");
  });

  test("only returns menstrual insights for opted-in female context", () => {
    const insight = getMenstrualInsights({
      gender: "female",
      menstrualCycle: { lastPeriod: "2026-05-01", cycleLength: 28, symptoms: ["cramps"] },
    });

    expect(insight).toContain("Menstrual cycle");
    expect(getMenstrualInsights({ gender: "male" })).toBe("");
  });
});
