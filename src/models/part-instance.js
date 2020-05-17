//@flow

export class PartInstance {
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
    organizationId: number;
    images: Array<number> = [];
    isFollowed: boolean;

    constructor(partMasterId: number, name: string, organizationId: number) {
        this.partMasterId = partMasterId;
        this.name = name;
        this.organizationId = organizationId;
    }
}