import { ResourceJSON, PropertyJSON } from 'adminjs';

export interface ColumnPreferences {
  columnOrder: string[];
  columnWidths: Record<string, number>;
  hiddenColumns: string[];
}

export interface ApplyColumnPreferencesOptions {
  /** Resource id of the owning side — its back-reference column will be excluded. */
  ownerResourceId?: string;
}

/**
 * Derives the ordered, filtered list of property descriptors to render in a
 * relations subtable, respecting user column preferences.
 */
export declare const applyColumnPreferences: (
  resource: ResourceJSON,
  preferences: ColumnPreferences,
  opts?: ApplyColumnPreferencesOptions
) => PropertyJSON[];
