import { StateService } from "../state.service";
import { Event81303 } from "../../models/event81303";
import { Event81303Item } from "../../models/event81303Item";

export const event81303Api = {
    createEvent81303Draft() {
        return this.axios.post('/v1/drafts/event81303')
            .then(this.resHandler)
            .then(({ event81303DraftId }) => this.getEvent81303Draft(event81303DraftId))
    },

    getEvent81303Draft(event81303DraftId: string) {
        return this.axios.get(`/v1/drafts/event81303/${event81303DraftId}`)
            .then(this.resHandler)
            .then(({ data }) => StateService.setEvent81303(data));
    },

    updateEvent81303Draft(event81303DraftId: string, event81303: Event81303) {
        return this.axios.put(`/v1/drafts/event81303/${event81303DraftId}`, event81303)
            .then(this.resHandler);
    },

    deleteEvent81303Draft(event81303DraftId: string) {
        return this.axios.delete(`/v1/drafts/event81303/${event81303DraftId}`)
            .then(this.resHandler);
    },

    addEvent81303Item(event81303DraftId: string, event81303Item: Event81303Item) {
        return this.axios.post(`/v1/drafts/event81303/${event81303DraftId}/event81303item`, event81303Item)
            .then(this.resHandler);
    },

    updateEvent81303Item(event81303ItemId: string, event81303Item: Event81303Item) {
        return this.axios.put(`/v1/drafts/event81303item/${event81303ItemId}`, event81303Item)
            .then(this.resHandler);
    },

    getEvent81303Items(event81303DraftId: string) {
        return this.axios.get(`/v1/drafts/event81303/${event81303DraftId}/event81303item`)
            .then(this.resHandler)
            .then(({ items }) => StateService.setEvent81303Items(items))
    },

    deleteEvent81303Item(event81303ItemId: string) {
        return this.axios.delete(`/v1/drafts/event81303item/${event81303ItemId}`)
            .then(this.resHandler)
            .then(() => StateService.deleteEvent81303ItemFromList(event81303ItemId))
    }
};