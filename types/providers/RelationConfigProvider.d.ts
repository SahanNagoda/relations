import { RecordJSON, ResourceJSON } from 'adminjs';
import React, { PropsWithChildren } from 'react';
import { RelationsFeatureOptions } from '../types/index.js';
type RelationConfigProps = PropsWithChildren<{
    relation: string;
    ownerRecord: RecordJSON;
    ownerResource: ResourceJSON;
    relations: RelationsFeatureOptions;
}>;
type UseRelationConfigResult = Omit<RelationConfigProps, 'children'> & {
    refreshToken: number;
    refresh: () => void;
};
export declare const RelationConfigProvider: React.FC<RelationConfigProps>;
export declare const useRelationConfig: () => UseRelationConfigResult;
export {};
