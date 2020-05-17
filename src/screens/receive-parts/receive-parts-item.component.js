import React from 'react';
import { ShipPartsItem } from "../ship-parts-item/ship-parts-item.component";
import BackendApi from "../../services/backend";
import { ShipPartItemView } from "../../models/ship-part-item-view";
import { PartInstanceView } from "../../models/part-instance-view";
import { Attachment } from "../../models/attachment";
import { branch } from "baobab-react/higher-order";
import { ReceiveReason } from "../../models/receiveReason";

type Props = {
    partInstance: PartInstanceView;
    shipPartItem: ShipPartItemView;
    shipItemAttachments: Array<Attachment>;
    receiveReasons: Array<ReceiveReason>;
}

@branch({
    partInstance: ['partInstance'],
    partMaster: ['partMaster'],
    shipPartItem: ['shipPartItem'],
    shipItemAttachments: ['shipItemAttachments'],
    receiveReasons: ['receiveReasons'],
})
export class ReceivePartItemScreen extends ShipPartsItem<Props> {
    isReceive = true;

    state = {
        receiveReasonId: null
    };

    componentDidMount() {
        super.componentDidMount();
        BackendApi.getReceiveReasons();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shipPartItem && nextProps.shipPartItem.reason) {
            this.setState({ receiveReasonId: nextProps.shipPartItem.reason.receiveReasonId });
        }

        if (nextProps.partInstance && !this.shipItemId &&
            (!this.props.partInstance || this.props.partInstance.partInstanceId !== nextProps.partInstance.partInstanceId)) {

            BackendApi.addReceivePartItem(this.eventDraftId, { partInstanceId: nextProps.partInstance.partInstanceId });
        }
    }
}
