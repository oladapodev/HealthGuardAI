import { describe, expect, test } from "bun:test";
import { extractJSON, safeParseJSON } from "../utils/json.js";

describe("json utilities", () => {
  test("extracts fenced JSON", () => {
    expect(extractJSON('```json\n{"safe":true}\n```')).toBe('{"safe":true}');
  });

  test("uses fallback when parsing fails", () => {
    expect(safeParseJSON("not json", { safe: false })).toEqual({ safe: false });
  });
});
