/**
 * Shared chart datum shape — selectors map demoStore → these rows.
 */

export interface DemoChartDatum {
  id: string;
  name: string;
  /** Compact axis label for bar charts. */
  shortName: string;
  value: number;
  fill: string;
}
