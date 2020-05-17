import { StateService } from "../state.service";

export const incomingShipmentsApi = {
    getIncomingShipmentsList(cursor: string) {
        return this.axios.get(`/v1/inboundShippingEvent`)
            .then(this.resHandler)
            .then(({ events, cursorNext }) => {
                if (cursor) {
                    StateService.concatIncomingShipments(events);
                } else {
                    StateService.setIncomingShipments(events);
                }

                return cursorNext;
            });
    },
};