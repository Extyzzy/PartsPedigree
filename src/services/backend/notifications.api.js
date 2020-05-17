import { StateService } from "../state.service";

export const notificationsApi = {
    getNotificationsList(cursor: string) {
        return this.axios.get(`/v1/users/me/notifications${cursor ? `?cursorNext=${cursor}` : ''}`)
            .then(this.resHandler)
            .then(({ notifications, cursorNext }) => {
                if (cursor) {
                    StateService.concatNotifications(notifications);
                } else {
                    StateService.setNotifications(notifications);
                }

                return cursorNext;
            });
    },

    deleteNotification(notificationId: string) {
        return this.axios.delete(`/v1/notifications/${notificationId}`)
            .then(this.resHandler)
            .then(() => StateService.removeNotificationFromList(notificationId));
    }
};