//@flow
import { ImageModel } from "./image";

export class SearchPartsItem {
    partMasterId: number;
    partName: string;
    country: {
        countryId: number;
        name: string;
    };
    createdAt: string;
    description: string;
    image: ImageModel;
    mpn: string;
    oem: string;
    isFollowed: boolean;
}