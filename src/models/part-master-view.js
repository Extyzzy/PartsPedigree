//@flow
import { ImageModel } from "./image";

export class PartMasterView {
    country: {
        countryId: number;
        name: string;
    };
    createdAt: string;
    image: ImageModel;
    mpn: string; //manufacturer part number
    oem: string;
    partName: string;
    partMasterId: number;
    description: string;
    opn: string; //organization part number
    exportControlledPart: boolean;
    orgPartNumber: string;
    orgPartName: string;
    uom: {
        uomId: number;
        name: string;
    };
    manufacturerCage: string;
    isFollowed: boolean;

    status: {
        name: string;
    };
    exportControlClassification: string;
    internationalCommodityCode: string;
    federalSupplyClass: string;
    nationalItemIdentificationNumber: string;
    isIuidRequired: boolean;
    netWeight: number;
    netWeightUOM: {
        uomId: number;
        name: string;
    };
    grossWeight: number;
    grossWeightUOM: {
        uomId: number;
        name: string;
    };
    isLifeLimited: boolean;
    shelfLifeExpiration: string;
    hazmat1: string;
    hazmat2: string;
    hazmat3: string;
    uidConstructNumber: string;
    serialized: string;
    isBatchManagedRequired: boolean;
    isSoftware: boolean;
    isElectrostaticSensitiveDevice: boolean;
    isRotables: boolean;
    isTimesLimited: boolean;
    lifeLimitedAssembly: string;

    orgCageCode: string;
    orgDescription: string;
}