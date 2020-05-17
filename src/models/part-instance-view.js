//@flow
import { Organization } from "./organization";
import { ImageModel } from "./image";
import { PartMasterView } from "./part-master-view";

export class PartInstanceView {
    partMaster: PartMasterView;
    partInstanceId: number;
    partMasterId: number;
    serialNumber: string;
    batchNumber: string;
    name: string;
    description: string;
    tsn: string;
    tsmoh: string;
    isSale: boolean = false;
    price: string;
    organization: Organization;
    createdAt: string;
    images: Array<ImageModel> = [];
    isFollowed: boolean;

    iuidType: {
        iuidTypeId: number;
        name: string;
    };
    iuid: string;
    manufactureDate: string;
    commodityCode: string;
    airworthinessCertificateTrackingNumber: string;
    acquisitionValue: number;
    acquisitionDate: string;
    condition: {
        partInstanceConditionId: number;
        name: string;
    };

    constructor(partMasterId: number) {
        this.partMasterId = partMasterId;
    }
}