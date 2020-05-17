import {StateService} from "../state.service";
import {AttachmentEvent} from "../../models/attachment-event";

export const attachmentEventApi = {
    createAttachmentEventDraft(data) {
        StateService.setAttachmentEvent(null);
        StateService.setAttachmentEventAttachments(null);

        return this.axios.post('/v1/drafts/eventAttach', data)
            .then(this.resHandler)
            .then(({eventDraftId}) => StateService.setAttachmentEvent(new AttachmentEvent(eventDraftId)));
    },

    getAttachmentEventDraft(eventDraftId: string) {
        StateService.setAttachmentEvent(null);

        return this.axios.get(`/v1/drafts/eventAttach/${eventDraftId}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setAttachmentEvent(data));
    },

    getAttachmentEventAttachments(eventDraftId: string) {
        StateService.setAttachmentEventAttachments(null);
        return this.axios.get(`/v1/drafts/eventAttach/${eventDraftId}/attachments`)
            .then(this.resHandler)
            .then(({attachments}) => {
                StateService.setAttachmentEventAttachments(attachments);
                return attachments
            });
    },

    deleteAttachmentEventAttachments(attachmentId: string) {
        return this.axios.delete(`/v1/attachments/${attachmentId}`)
            .then(this.resHandler)
            .then(() => StateService.removeAttachmentEventAttachmentsFromList(attachmentId));
    },

    submitAttachmentEventDraft(eventDraftId: string) {
        return this.axios.post(`/v1/drafts/eventAttach/${eventDraftId}/submit`)
            .then(this.resHandler);
    },

    deleteAttachmentEvent(eventDraftId: string) {
        return this.axios.delete(`/v1/drafts/eventAttach/${eventDraftId}`)
            .then(this.resHandler);
    }
};