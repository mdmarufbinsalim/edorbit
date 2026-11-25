import type { LonLat } from "@edorbit/core";

/** A year with an honesty flag. Years are CE; negative numbers are BCE. */
export interface HistoricalYear {
  year: number;
  /** True when sources give a range or "about" this year. Shown as "c. 1454". */
  approximate?: boolean;
}

/** Something that happened, with the sources that back it. */
export interface DatedEvent extends HistoricalYear {
  id: string;
  label: string;
  /** Ids of `Source`s in the concept's references. At least one. */
  sourceIds: readonly string[];
  note?: string;
}

/** A named place on the map. */
export interface Place {
  id: string;
  name: string;
  lonLat: LonLat;
  /** Today's name or country, when it differs. */
  modern?: string;
}
