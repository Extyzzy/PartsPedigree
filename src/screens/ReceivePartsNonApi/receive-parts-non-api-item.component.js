import React from 'react';
import { ShipPartsItem } from "../ship-parts-item/ship-parts-item.component";
import BackendApi from "../../services/backend";
import { ShipPartItemView } from "../../models/ship-part-item-view";
import { PartInstanceView } from "../../models/part-instance-view";
import { Attachment } from "../../models/attachment";
import { branch } from "baobab-react/higher-order";
import { ReceiveReason } from "../../models/receiveReason";

@branch({
    partInstance: ['partInstance'],
    partMaster: ['partMaster'],
    shipPartItem: ['shipPartItem'],
    shipItemAttachments: ['shipItemAttachments'],
    receiveReasons: ['receiveReasons'],
})
export class ReceivePartNonApiItemScreen extends ShipPartsItem<Props> {

}
