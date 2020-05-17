//@flow
import { partMasterUOM } from "../constants/uoms";

export class PartMaster {
    mpn: string; //manufacturer part number
    oem: string;
    partName: string;
    partMasterId: number;
    description: string;
    opn: string; //organization part number
    countryId: number;
    imageId: number;
    exportControlledPart: boolean;
    orgPartNumber: string;
    orgPartName: string;
    uomId: number;
    manufacturerCage: string;
    isFollowed: boolean;

/*    constructor() {
        this.uomId = partMasterUOM.Ea;
    }*/
}