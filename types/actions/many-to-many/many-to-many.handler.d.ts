import { ActionContext, ActionQueryParameters } from 'adminjs';
import type { ManyToManyRelationOptions, RelationLoaderHandlerConfig } from '../../types/index.js';
export declare const manyToManyHandler: (recordId: string, config: RelationLoaderHandlerConfig<ManyToManyRelationOptions>, query: ActionQueryParameters | undefined, context: ActionContext) => Promise<{
    meta: {
        total: number;
        perPage: number;
        page: number;
        sortBy: string;
        direction: "desc" | "asc";
    };
    records: import("adminjs").RecordJSON[];
    record: import("adminjs").RecordJSON | undefined;
}>;
