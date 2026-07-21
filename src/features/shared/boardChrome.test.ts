import { describe, expect, it } from "vitest";
import {
  BOARD_CHART_FILL,
  BOARD_CHROME_TONE,
  OPERATIONS_BOARD_CHART_FILL,
  OPERATIONS_BOARD_COLUMN_TONE,
  PIPELINE_COLUMN_CHART_FILL,
  PIPELINE_COLUMN_TONE,
} from "./boardChrome";

describe("boardChrome", () => {
  it("exposes semantic tone shells used by both boards", () => {
    expect(BOARD_CHROME_TONE.queue).toContain("rose");
    expect(BOARD_CHROME_TONE.ready).toContain("emerald");
    expect(BOARD_CHROME_TONE.inProgress).toContain("stone");
    expect(BOARD_CHROME_TONE.cyan).toContain("cyan");
  });

  it("maps every Operations Board column to a tone", () => {
    expect(Object.keys(OPERATIONS_BOARD_COLUMN_TONE).sort()).toEqual(
      ["completed", "inProgress", "queued", "ready"].sort(),
    );
  });

  it("maps every Pipeline column to a tone", () => {
    expect(Object.keys(PIPELINE_COLUMN_TONE).sort()).toEqual(
      [
        "acquiring",
        "assigned",
        "hold",
        "packaging",
        "problem",
        "ready",
        "review",
      ].sort(),
    );
  });

  it("exposes chart fills aligned with board chrome tones", () => {
    expect(OPERATIONS_BOARD_CHART_FILL.queued).toBe(BOARD_CHART_FILL.queue);
    expect(OPERATIONS_BOARD_CHART_FILL.ready).toBe(BOARD_CHART_FILL.ready);
    expect(PIPELINE_COLUMN_CHART_FILL.acquiring).toBe(BOARD_CHART_FILL.cyan);
    expect(PIPELINE_COLUMN_CHART_FILL.problem).toBe(BOARD_CHART_FILL.red);
    expect(Object.keys(PIPELINE_COLUMN_CHART_FILL).sort()).toEqual(
      Object.keys(PIPELINE_COLUMN_TONE).sort(),
    );
  });
});
