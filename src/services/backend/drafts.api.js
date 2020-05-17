import {StateService} from "../state.service";
import {ShipPartItem} from "../../models/ship-part-item";
import {ShipPart} from "../../models/ship-part";

export const draftsApi = {
    createEventDraft() {
        StateService.setShipPartItems(null);
        StateService.setShipPart(null);
        StateService.setShipPartAttachments(null);

        return this.axios.post('/v1/drafts/event')
            .then(this.resHandler)
            .then(({eventDraftId}) => StateService.setShipPart(new ShipPart(eventDraftId)));
    },
    createReceiveDraft() {
        StateService.setShipPartItems(null);
        StateService.setShipPart(null);
        StateService.setShipPartAttachments(null);

        return this.axios.post('/v1/drafts/receive')
            .then(this.resHandler)
            .then(({eventDraftId}) => {
                StateService.setShipPart(new ShipPart(eventDraftId));
                return eventDraftId
            });
    },


    getEventDraft(eventDraftId: string) {
        StateService.setShipPart(null);
        return this.axios.get(`/v1/drafts/event/${eventDraftId}`)
            .then(this.resHandler)
            .then(({data}) => {
                StateService.setShipPart(data);
                if (data.toOrganization && data.toOrganization.organization_id) {
                    this.getOrganizationAddress(data.toOrganization.organization_id);
                }
            });
    },

    getShipPartAttachments(eventDraftId: string) {
        StateService.setShipPartAttachments(null);
        return this.axios.get(`/v1/drafts/event/${eventDraftId}/attachments`)
            .then(this.resHandler)
            .then(({attachments}) => StateService.setShipPartAttachments(attachments));
    },

    updateEventDraft(eventDraftId: string, shipPart: ShipPart) {
        return this.axios.put(`/v1/drafts/event/${eventDraftId}`, shipPart)
            .then(this.resHandler).then(data => {
                return data.eventId
            });
    },

    deleteEventDraft(eventDraftId: string) {
        return this.axios.delete(`/v1/drafts/event/${eventDraftId}`)
            .then(this.resHandler);
    },

    addShipPartItem(eventDraftId: string, shipPartItem: ShipPartItem) {
        StateService.setShipPartItem(null);
        return this.axios.post(`/v1/drafts/event/${eventDraftId}/shipitem`, {
            ...shipPartItem,
            quantity: -1
        })//toDo: jrpc architectural solution
            .then(this.resHandler)
            .then(({shipItemId}) => this.getPartShipItem(shipItemId));
    },

    updateShipPartItem(shipPartItem) {
        return this.axios.put(`/v1/drafts/shipitem/${shipPartItem.shipItemId}`, shipPartItem)
            .then(this.resHandler);
    },

    deleteShipItem(shipItemId: string) {
        return this.axios.delete(`/v1/drafts/shipitem/${shipItemId}`)
            .then(this.resHandler)
            .then(() => StateService.deleteShipItemFromList(shipItemId));
    },

    getPartShipItem(shipItemId: string) {
        return this.axios.get(`/v1/drafts/shipitem/${shipItemId}`)
            .then(this.resHandler)
            .then(({data}) => {
                StateService.setShipPartItem(data);
                StateService.setPartInstance(data.partInstance);
                StateService.setPartMaster(data.partMaster);
            });
    },

    getShipItemAttachments(shipItemId: string) {
        StateService.setShipItemAttachments(null);
        return this.axios.get(`/v1/drafts/shipitem/${shipItemId}/attachments`)
            .then(this.resHandler)
            .then(({attachments}) => StateService.setShipItemAttachments(attachments));
    },

    getPartShipItemsList(eventDraftId: string) {
        StateService.setShipPartItems(null);
        return this.axios.get(`/v1/drafts/event/${eventDraftId}/shipitem`)
            .then(this.resHandler).then(({items}) => {
                let result = [];
                items.map(item => {
                    if (item.cureDate === -1) {
                        delete item.cureDate;
                    }
                });
                items.map((item, index) => {
                    if (item['quantity'] !== -1) {
                        result.push(item);
                    }
                });
                StateService.setShipPartItems(result)
            });
    },

    //receive part
    createReceiveEventDraft(eventId: string) {
        StateService.setReceivePart();

        return this.axios.post(`/v1/drafts/receive`, {eventId})
            .then(this.resHandler)
            .then(({eventDraftId}) => {
                this.getReceiveEventDraft(eventDraftId);
                this.getReceivePartItemsList(eventDraftId);
                this.getReceivePartAttachments(eventDraftId);
                this.refreshPartInstanceTimeLine();
            });
    },
    updateReceiveEventDraft(eventDraftId, eventDraft) {
        return this.axios.put(`/v1/drafts/receive/${eventDraftId}`, eventDraft)
            .then(this.resHandler)
            .then(({eventDraftId}) => {
                return eventDraftId
            })
    },
    updateAttachmentEventDraft(eventDraftId, eventDraft) {
        return this.axios.put(`/v1/drafts/eventAttach/${eventDraftId}`, eventDraft)
            .then(this.resHandler)
            .then(({eventDraftId}) => {
                return eventDraftId
            })
    },

    getReceivePartAttachments(eventDraftId: string) {
        StateService.setShipPartAttachments(null);
        return this.axios.get(`/v1/drafts/receive/${eventDraftId}/attachments`)
            .then(this.resHandler)
            .then(({attachments}) => StateService.setShipPartAttachments(attachments));
    },

    getReceiveEventDraft(eventDraftId: string) {
        StateService.setReceivePart(null);
        return this.axios.get(`/v1/drafts/receive/${eventDraftId}`)
            .then(this.resHandler)
            .then(({data}) => StateService.setReceivePart(data));
    },

    getReceivePartItemsList(eventDraftId: string) {
        StateService.setShipPartItems(null);

        return this.axios.get(`/v1/drafts/receive/${eventDraftId}/shipitem`)
            .then(this.resHandler)
            .then(({items}) => StateService.setShipPartItems(items));
    },

    addReceivePartItem(eventDraftId: string, shipPartItem: ShipPartItem) {
        let item = JSON.parse(JSON.stringify(shipPartItem));
        for (let key in shipPartItem.partInstance) {
            item[key] = shipPartItem.partInstance[key]
        }
        delete item.partInstance;
        delete item.partMaster;
        console.log(item, 'item');
        return this.axios.post(`/v1/drafts/receive/${eventDraftId}/shipitem`, item)
            .then(this.resHandler)
    },

    deleteReceiveDraft(eventDraftId: string) {
        return this.axios.delete(`/v1/drafts/receive/${eventDraftId}`)
            .then(this.resHandler);
    },

    submitReceiveDraft(eventDraftId: string, shipItemsId,) {
        return this.axios.post(`/v1/drafts/receive/${eventDraftId}/submit`, {partInstanceIds: shipItemsId})
            .then(this.resHandler);
    },
    submitReceivedItems(shipItemsId, eventId) {
        return this.axios.post(`/v1/events/${eventId}/receive`, {partInstanceIds: shipItemsId})
            .then(this.resHandler);
    },
    createCofCDraft(shippingEventId) {
        return this.axios.post(`/v1/eventcofcdrafts`, {shippingEventId: shippingEventId}).then(this.resHandler).then((data) => {
            {
                return data
            }
        })
    },
    updateCofCDraft(salesOrderNumber, salesOrderLineNumber, remarks, eventCofcDraftId) {
        console.log(salesOrderNumber, salesOrderLineNumber, remarks, 'ceva');
        console.log({
            salesOrderNumber: salesOrderNumber, salesOrderLineNumber: salesOrderLineNumber, remarks: remarks
        }, 'ceva');
        return this.axios.put(`/v1/eventcofcdrafts/${eventCofcDraftId}`, {
            salesOrderNumber: salesOrderNumber, salesOrderLineNumber: salesOrderLineNumber, remarks: remarks
        }).then(this.resHandler).then(response => console.log(response))
    },
    submitCofCDraft(eventCofcDraftId) {
        return this.axios.post(`/v1/eventcofcdrafts/${eventCofcDraftId}/submit`, {eventCofcDraftId: eventCofcDraftId}).then(this.resHandler).then(response => {return response})
    },
    getDrafts(cursor: string) {
        return this.axios.get(`/v1/drafts`)
            .then(this.resHandler)
            .then(({draftEvents, cursorNext}) => {
                if (cursor) {
                    StateService.concatDrafts(draftEvents);
                } else {
                    StateService.setDrafts(draftEvents);
                }

                return cursorNext;
            });
    },
    updateReceiveingEvent(eventDraftId, event) {
        return this.axios.put(`/v1/drafts/receive/${eventDraftId}`, event)
            .then(this.resHandler)
            .then((response) => {
                return response
            });
    },
    // getOrganizationForCofC(organizationId) {
    //     return fetch(`http://18.216.85.157:3002/v1/organizations/${organizationId}`).then((response) => response.json()).then(result => {
    //         console.log(result)
    //     })
    // }
};
