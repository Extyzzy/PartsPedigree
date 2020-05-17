export class Event81303 {
    event81303DraftId: number;
    orderNumber: string;
    status: string;
    remarks: string;
    isApproveOrCertifyType: boolean;
    itemsApproved: boolean;
    authorizationNumber: string;
    returnToService: boolean;
    certificateNumber: boolean;

    constructor() {
        this.isApproveOrCertifyType = true;
        this.itemsApproved = true;
        this.returnToService = true;
    }
}