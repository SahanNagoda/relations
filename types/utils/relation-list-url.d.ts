export declare const RELATION_TAB_PER_PAGE: number;

export declare const EXACT_KEYS_PARAM: string;

export declare const joinFiltersFromOwner: (
  relation: {
    source?: { joinKey?: string; joinKeys?: string[] };
    target?: { joinKey?: string; joinKeys?: string[] };
  } | null | undefined,
  ownerRecord: { id?: string; params?: Record<string, unknown> } | null | undefined,
) => Record<string, string> | null;

export declare const resourceListUrlWithFilters: (
  resourceId: string | undefined,
  filters: Record<string, string> | null | undefined,
) => string | null;
