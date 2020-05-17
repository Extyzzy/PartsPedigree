import { StateService } from "../state.service";

export const outBoundShipments = {
    getOutBoundsList(cursor: string) {
        return this.axios.get(`/v1/outboundShippingEvent`)
            .then(this.resHandler)
            .then(({ events, cursorNext }) => {
                if (cursor) {
                    StateService.concatOutBoundShipments(events);
                } else {
                    StateService.setOutBoundShipments(events);
                }

                return cursorNext;
            });
    },
};