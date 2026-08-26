import { ResourceJSON, PropertyJSON } from 'adminjs';

export interface ColumnPreferences {
  columnOrder: string[];
  columnWidths: Record<string, number>;
  hiddenColumns: string[];
}

export interface ApplyColumnPreferencesOptions {
  /** Resource id of the owning side — its AdminJS `reference` column will be excluded. */
  ownerResourceId?: string;
  /** Target join key(s). Every row in the subtable has the same value in these columns. */
  joinKeys?: string[];
}

export interface RelationSide {
  joinKey?: string;
  joinKeys?: string[];
}

export declare const joinKeysOf: (side?: RelationSide | null) => string[];

export declare const isOwnerJoinColumn: (
  prop: PropertyJSON | { name?: string; propertyPath?: string; path?: string; reference?: string } | null,
  opts?: ApplyColumnPreferencesOptions
) => boolean;

export declare const withoutOwnerJoinColumns: <T extends { name?: string; propertyPath?: string; path?: string; reference?: string }>(
  properties: T[] | undefined,
  opts?: ApplyColumnPreferencesOptions
) => T[];

/**
 * Derives the ordered, filtered list of property descriptors to render in a
 * relations subtable, respecting user column preferences.
 */
export declare const applyColumnPreferences: (
  resource: ResourceJSON,
  preferences: ColumnPreferences,
  opts?: ApplyColumnPreferencesOptions
) => PropertyJSON[];
