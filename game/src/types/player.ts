import type { PaUsers, PaConstruct } from "@prisma/client";

/**
 * A flattened player object returned by `getPlayerByNick`.
 * Merges PaUsers fields with PaConstruct fields (excluding PaConstruct's own `id` and relation array).
 */
export type PaUserWithConstruct = PaUsers &
  Omit<PaConstruct, "id" | "PaUsers">;

/**
 * Extended player type that allows dynamic string-key access.
 * Used only in generic table components (AdvancedDataTable, ActionButton, Production)
 * where field names are determined at runtime from constant config arrays.
 */
export interface PaPlayer extends PaUserWithConstruct {
  [key: string]: number | string | null;
}

/**
 * Base player type used in contexts where construction fields are not needed
 * (e.g., ranking tables).
 */
export type PaPlayerBase = PaUsers & {
  [key: string]: number | string | null;
};
