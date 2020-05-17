import { Organization } from "./organization";

export class ShipPartView {
    eventDraftId: number;
    submit: boolean;
    shipmentId: string;
    fromOrganization: Organization;
    toOrganization: Organization;
    shipment: string;
    carrier: string;
    ready: number;
    containerCount: number;
    totalWeight: number;
    weightUOMId: number;
    totalValue: number;
    valueUOMId: number;
    weightUOM: {
        uomId: string;
        name: string;
    };
    valueUOM: {
        uomId: string;
        name: string;
    };
    PONumbers: string;
}
