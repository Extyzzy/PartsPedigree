//@flow
import { weightUOMS, valueUOMS } from "../constants/uoms";

export class ShipPart {
    eventDraftId: number;
    submit: boolean;
    fromOrganizationId: number;
    toOrganizationId: number;
    shipment: string;
    carrier: string;
    ready: number;
    containerCount: number;
    totalWeight: number;
    weightUOMId: number;
    totalValue: number;
    valueUOMId: number;

    constructor(eventDraftId) {
        this.eventDraftId = eventDraftId;
        this.weightUOMId = weightUOMS.kg;
        this.valueUOMId = valueUOMS.USD;
    }
}
