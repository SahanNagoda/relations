import { ActionContext, ActionQueryParameters } from 'adminjs';
import type { OneToManyRelationOptions, RelationLoaderHandlerConfig } from '../../types/index.js';
export declare const oneToManyHandler: (recordId: string, config: RelationLoaderHandlerConfig<OneToManyRelationOptions>, query: ActionQueryParameters | undefined, context: ActionContext) => Promise<{
    meta: {
        total: number;
        perPage: number;
        page: number;
        direction: any;
        sortBy: any;
    };
    records: import("adminjs").RecordJSON[];
    record: import("adminjs").RecordJSON | undefined;
}>;
