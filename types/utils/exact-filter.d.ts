import { BaseResource, Filter } from 'adminjs';
/**
 * Builds an AdminJS Filter that uses exact equality for the given keys
 * (foreign-key / join-key lookups) instead of SQL LIKE.
 */
export declare const createFilterWithExactKeys: (filters: Record<string, unknown>, resource: BaseResource, exactKeys?: string[]) => Filter;
