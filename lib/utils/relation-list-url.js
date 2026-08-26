import { joinKeysOf } from './column-preferences.js';

/** Rows fetched per page in a details-view relation subtable. */
export const RELATION_TAB_PER_PAGE = 50;

/**
 * Query param listing filter columns that must use `=` rather than `LIKE`.
 * Keep in sync with AdminPanelDemo `src/admin/exact-keys.ts`.
 */
export const EXACT_KEYS_PARAM = 'exactKeys';

/**
 * Join filters that scope the child list to this parent.
 *
 * Returns `null` when a scoping value is missing: a partial filter would list
 * rows that belong to other parents.
 */
export const joinFiltersFromOwner = (relation, ownerRecord) => {
  const sourceKeys = joinKeysOf(relation?.source);
  const targetKeys = joinKeysOf(relation?.target);
  if (!sourceKeys.length || sourceKeys.length !== targetKeys.length) return null;

  const filters = {};
  for (let i = 0; i < targetKeys.length; i += 1) {
    let value = ownerRecord?.params?.[sourceKeys[i]];
    if ((value === null || value === undefined || value === '') && sourceKeys[i] === 'id') {
      value = ownerRecord?.id;
    }
    if (value === null || value === undefined || value === '') return null;
    filters[targetKeys[i]] = String(value);
  }
  return filters;
};

/**
 * List-view path for `resourceId` with `filters.*` query params, matching
 * SimpleList / FilterDrawer. Join columns are also listed in `exactKeys` so
 * the list uses `=` the same way the relation tab does.
 *
 * This is a router path (basename already includes rootPath).
 */
export const resourceListUrlWithFilters = (resourceId, filters) => {
  if (!resourceId || !filters || !Object.keys(filters).length) return null;
  const params = new URLSearchParams();
  const keys = Object.keys(filters);
  for (const key of keys) {
    params.set(`filters.${key}`, filters[key]);
  }
  params.set(EXACT_KEYS_PARAM, keys.join(','));
  return `/resources/${resourceId}?${params.toString()}`;
};
