import { ShipPartItemView } from "../../models/ship-part-item-view";
import { PartInstanceView } from "../../models/part-instance-view";
import { Attachment } from "../../models/attachment";
import { branch } from "baobab-react/higher-order";
import { ShipPartsItem } from "./ship-parts-item.component";
import BackendApi from "../../services/backend";

type Props = {
    partInstance: PartInstanceView;
    shipPartItem: ShipPartItemView;
    shipItemAttachments: Array<Attachment>;
}

@branch({
    partInstance: ['partInstance'],
    partMaster: ['partMaster'],
    shipPartItem: ['shipPartItem'],
    shipItemAttachments: ['shipItemAttachments'],
})
export class ShipPartItemScreen extends ShipPartsItem<Props> {
    componentWillReceiveProps(nextProps) {
        const { partInstance, partMaster } = nextProps;
        const cPM = this.props.partMaster;
        const cPI = this.props.partInstance;

        if (this.shipItemId || (!partMaster && !partInstance)) {
            return;
        }

        if (cPM && partMaster && partMaster.partMasterId === cPM.partMasterId) {
            return;
        }


        if (cPI && partInstance && partInstance.partInstanceId === cPI.partInstanceId) {
            return;
        }

        const newItem = partInstance ?
            { partInstanceId: partInstance.partInstanceId } :
            { partMasterId: partMaster.partMasterId };

        BackendApi.addShipPartItem(this.eventDraftId, newItem);
    }
}