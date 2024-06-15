import { type RecordJSON, type ResourceJSON } from 'adminjs';
import { FC } from 'react';
interface Props {
    targetResource: ResourceJSON;
    ownerResource: ResourceJSON;
    ownerRecord: RecordJSON;
    relation: string;
    onCloseModal: (refresh?: boolean) => void;
}
export declare const AddItemModal: FC<Props>;
export default AddItemModal;
