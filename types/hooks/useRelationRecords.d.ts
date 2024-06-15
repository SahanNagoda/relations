import { type ListActionResponse, RecordJSON, ResourceJSON } from 'adminjs';
type UseRelationRecordsProps = {
    relation: string;
    record: RecordJSON;
    resource: ResourceJSON;
    targetResourceId: string;
    tab: string;
};
export declare const useRelationRecords: (props: UseRelationRecordsProps) => {
    data: ListActionResponse | undefined;
    isLoading: boolean;
};
export {};
