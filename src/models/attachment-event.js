import { Attachment } from "./attachment";

export class AttachmentEvent {
    eventDraftId: number;
    userId: number;
    eventTypeId: number;
    attachments: Array<Attachment>;

    constructor(eventDraftId) {
        this.eventDraftId = eventDraftId;
    }
}