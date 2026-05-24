import { RecordJSON, ResourceJSON, PropertyJSON } from 'adminjs';
import React from 'react';
type Props = {
    resource: ResourceJSON;
    record: RecordJSON;
    isLoading?: boolean;
    /** Ordered, filtered properties to render. Falls back to resource.listProperties when omitted. */
    properties?: PropertyJSON[];
};
export declare const RelationRecordInList: React.FC<Props>;
export {};
