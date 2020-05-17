import { OrganizationAddress } from "./organization-address";
import { Event81303ItemView } from "./event81303ItemView";
import { Organization } from "./organization";

export class Event81303View {
    event81303DraftId: string;
    organizationName: string;
    trackingNumber: string;
    organization: Organization;
    organizationAddress: OrganizationAddress;
    userId: number;
    orderNumber: string;
    status: string;
    remarks: string;
    isApproveOrCertifyType: boolean;
    itemsApproved: boolean;
    authorizationNumber: string;
    returnToService: boolean;
    certificateNumber: boolean;
    items: Array<Event81303ItemView>;
}