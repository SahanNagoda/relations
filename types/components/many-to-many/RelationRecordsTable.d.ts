import { ListActionResponse, ResourceJSON } from 'adminjs';
import React from 'react';
type Props = {
    targetResource: ResourceJSON;
    records: ListActionResponse['records'];
    isLoading: boolean;
};
export declare const RelationRecordsTable: React.FC<Props>;
export {};
