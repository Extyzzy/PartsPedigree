//@flow
import { PartMasterView } from "./part-master-view";
import { PartInstanceView } from "./part-instance-view";
import { Attachment } from "./attachment";

export class ReceivePartItemView {
    shipItemId: number;
    eventDraftId: number;
    serialNumber: string;
    batchNumber: string;
    quantity: number;
    poNumber: string;
    issue: string;
    materialSpec: string;
    cureDateCode: string;
    cureDate: number;
    clause_151_dfmelt: string;
    clause_002c_merc: string;
    adviceNote: string;
    partInstanceId: number;
    partMaster: PartMasterView;
    partInstance: PartInstanceView;
    attachments: Array<Attachment>;
    eventId: string;
}