import { describe, expect, test } from "bun:test";
import { parseLabText } from "../utils/parser.js";

describe("parseLabText", () => {
  test("extracts common lab markers with values", () => {
    const parsed = parseLabText(`
      Hemoglobin 11.2 g/dL
      Glucose 94 mg/dL
      LDL 130 mg/dL
      TSH 2.1 mIU/L
    `);

    expect(parsed.hemoglobin.value).toBe(11.2);
    expect(parsed.glucose.value).toBe(94);
    expect(parsed.ldl.value).toBe(130);
    expect(parsed.tsh.value).toBe(2.1);
  });
});
