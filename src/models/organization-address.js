import { Country } from "./country";
import { Organization } from "./organization";

export class OrganizationAddress {
    addressId: number;
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: Country;
    organization: Organization;
    postalCode: string;
    stateCode: string;
}