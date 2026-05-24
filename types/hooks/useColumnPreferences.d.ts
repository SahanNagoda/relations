import { ColumnPreferences } from '../utils/column-preferences.js';

export interface UseColumnPreferencesReturn {
  preferences: ColumnPreferences;
  loaded: boolean;
}

/**
 * Read-only hook that fetches column preferences for a given resource from
 * /api/column-preferences/:resourceId.
 */
export declare const useColumnPreferences: (resourceId: string | undefined) => UseColumnPreferencesReturn;
