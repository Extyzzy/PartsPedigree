//@flow
import { valueUOMS } from "../constants/uoms";

export class ShipPartItem {
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
    receiveReasonId: number;

    invoiceNumber: string;
    invoiceDate: number;
    unitPrice: number;
    invoiceCurrency: number;
    lineTaxValue: number;
    taxRateApplied: number;

    constructor() {
        this.invoiceCurrency = valueUOMS.GBP;
    }
}
