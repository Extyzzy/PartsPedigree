import {StateService} from "../state.service";
import {ShareEventModel} from "../../models/share-event";
import {EventTypes} from "../../utils/EventTypes";

export const eventApi = {
    rejectEventRequest(eventRequestId: string) {
        return this.axios.put(`/v1/request/${eventRequestId}/denied`)
            .then(this.resHandler)
            .then(() => {
                StateService.removeRequestFromList(eventRequestId);
            });
    },

    acceptEventRequest(eventRequestId: string) {
        return this.axios.put(`/v1/request/${eventRequestId}/approve`)
            .then(this.resHandler)
            .then(() => {
                StateService.removeRequestFromList(eventRequestId);
            });
    },

    requestEventAccess(eventId: string) {
        return this.axios.post(`/v1/events/${eventId}/request`)
            .then(this.resHandler);
    },

    removeShipPartAttachment(attachmentId: string) {
        return this.axios.delete(`/v1/attachments/${attachmentId}`)
            .then(this.resHandler)
            .then(() => StateService.removeShipPartAttachmentFromList(attachmentId));
    },

    updateShipPartAttachment(attachmentId: string, description: string, tags: Array<number>) {
        return this.axios.put(`/v1/attachments/${attachmentId}`, {description, tags})
            .then(this.resHandler);
    },
    SubmitArrivalDraft(eventDraftId) {
    return this.axios.post(`/v1/drafts/arrival/${eventDraftId}/submit`).then(this.resHandler).then(data => console.log(data, 'dataFromResponse'));
    },
    UpdateArrivalDraft(eventDraftId, containerCount) {
        return this.axios.put(`/v1/drafts/arrival/${eventDraftId}`, {containerCount: containerCount}).then(this.resHandler).then(data => console.log(data, 'dataFromResponse'));
    },

    removeShipItemAttachment(attachmentId: string) {
        return this.axios.delete(`/v1/attachments/${attachmentId}`)
            .then(this.resHandler)
            .then(() => StateService.removeShipItemAttachmentFromList(attachmentId));
    },

    getAttachmentById(attachmentId) {
        return this.axios.get(`/v1/attachments/${attachmentId}`)
            .then(this.resHandler)
    },
    getAttachments(type, partId) {
        return this.axios.get(`/v1/parts/${type}/${partId}/attachments`)
            .then(this.resHandler)
            .then(data => {
                this.axios.get(`v1/attachments/${data.attachments[0].attachmentId}/download?eventId=${data.attachments[0].event.eventId}`)
                    .then(this.resHandler)
                    .then(data => {
                        console.info(`heey bro`, data);
                    });

                StateService.setAttachmentsTimeline(data.attachments)
            })
    },

    getEventById(eventId: string, eventTypeId: number) {
        if (!eventTypeId) {
            StateService.setEvent(null);
            StateService.setEventAccessRequest(null);

            return Promise.all([
                this.axios.get(`/v1/events/${eventId}`).then(this.resHandler),
                this.getSharesById(eventId),
            ])
                .then(([{event, requests}, {users}]) => {
                    event.users = users;
                    StateService.setEventAccessRequest(requests);
                    StateService.setEvent(event);
                });
        } else {
            const lastShipmentEvent = StateService.getLastShipmentEvent();
            if (eventTypeId === EventTypes.SHIPMENT) {
                StateService.setEvent(null);
                StateService.setEventAccessRequest(null);
                return Promise.all([
                    this.axios.get(`/v1/events/${eventId}`).then(this.resHandler),
                    this.getSharesById(eventId),
                ])
                    .then(([{event, requests}, {users}]) => {
                        event.users = users;
                        StateService.setEventAccessRequest(requests);
                        StateService.setEvent(event);
                        StateService.setLastShipmentEvent(event);
                    });
            } else if (eventTypeId === EventTypes.RECEIVING || eventTypeId
                === EventTypes.ARRIVAL) {
                StateService.setEvent(null);
                StateService.setEventAccessRequest(null);
                return Promise.all([
                    this.axios.get(`/v1/events/${eventId}`).then(this.resHandler),
                    this.getSharesById(eventId),
                ])
                    .then(([{event, requests}, {users}]) => {
                        event.users = users;
                        StateService.setEventAccessRequest(requests);
                        StateService.setEvent(event);
                        const lastShipmentEvent = StateService.getLastShipmentEvent();
                        if (lastShipmentEvent) {
                            const receivingEvent = lastShipmentEvent.receivingEvents.find((event) => event.eventId === eventId);
                            if (!receivingEvent) {
                                const lastShipingEventId = event.shippingEventId;
                                if (lastShipingEventId) {
                                    return Promise.all([
                                        this.axios.get(`/v1/events/${lastShipingEventId}`).then(
                                            this.resHandler),
                                    ])
                                        .then(([{event}]) => {
                                            StateService.setLastShipmentEvent(event);
                                        })
                                }
                            }
                        } else {
                            const lastShipingEventId = event.shippingEventId;
                            if (lastShipingEventId) {
                                return Promise.all([
                                    this.axios.get(`/v1/events/${lastShipingEventId}`).then(
                                        this.resHandler)
                                ])
                                    .then(([{event, requests}]) => {
                                        StateService.setLastShipmentEvent(event);
                                    })
                            }
                        }
                    });
            }
        }
    },

    shareEvent(eventId: string, shareEventData: ShareEventModel) {
        return this.axios.put(`/v1/events/${eventId}/share`, shareEventData)
            .then(data => this.resHandler(data, false));
    },

    getSharesById(eventId: string) {
        return this.axios.get(`/v1/events/${eventId}/share`)
            .then(this.resHandler);
    },

    arrivalEvent(eventId: string) {
        return this.axios.post(`/v1/events/${eventId}/arrival`)
            .then(this.resHandler);
    },
    followEvent(eventId: string) {
        return this._toggleFollowEvent('post', eventId);
    },

    unfollowEvent(eventId: string) {
        return this._toggleFollowEvent('delete', eventId);
    },

    _toggleFollowEvent(action: string, eventId: string) {
        return this.axios[action](`/v1/events/${eventId}/follow`)
            .then(this.resHandler);
    },
    arrivalEventDraft(eventId) {
        return this.axios.post(`/v1/drafts/arrival`, {eventId: eventId}).then(this.resHandler).then(data => {
            console.log(data, 'data');
            return data
        })
    }
};