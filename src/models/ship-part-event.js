import { ShipPartView } from "./ship-part-view";
import { ShipPartItemView } from "./ship-part-item-view";
import { Attachment } from "./attachment";

export class ShipPartEvent extends ShipPartView {
    eventId: string;
    items: Array<ShipPartItemView>;
    attachments: Array<Attachment>;
}