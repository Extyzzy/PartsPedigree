import FCM, {
    FCMEvent, NotificationType, WillPresentNotificationResult
} from "react-native-fcm";
import { AsyncStorage, Platform } from 'react-native';
import BackendApi from "./backend";
import { Event } from "../components/event/event.component";

const TOKEN = 'FCM:TOKEN';

class NotificationService {
    async init(navigation) {
        this.navigation = navigation;
        try {
            await this.requestPermissions();
            await this.getToken();

            this.subscribeForNotifications();
            //this.subscribeForRefreshToken();

        } catch (e) {
            console.log(e);
        }
    }

    async requestPermissions() {
        try {
            await FCM.requestPermissions({
                badge: true,
                sound: true,
                alert: true
            });
        } catch (e) {
            console.log(e);
        }
    }

    subscribeForNotifications() {
        FCM.on(FCMEvent.Notification, notif => {

            if(Platform.OS ==='ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification){
                notif.finish(WillPresentNotificationResult.All);
                return;
            }

            if (notif.opened_from_tray && notif.event_id) {
                const screen = Event.getScreenNameByEventypeId(notif.event_type_id);
                this.navigation.navigate(screen, { eventId: notif.event_id});
            } else if (!notif.local_notification && Platform.OS ==='android') {
                FCM.presentLocalNotification({
                    ...notif.fcm,
                    id: new Date().valueOf().toString(),
                    priority: "high",
                    sound: "default",
                    click_action: 'fcm.ACTION.HELLO',
                    show_in_foreground: true,
                    wake_screen: true,
                });
            }
        });
    }

    subscribeForRefreshToken() {
        FCM.on(FCMEvent.RefreshToken, token => token && this.updateToken(token));
    }

    getLocalToken() {
        return AsyncStorage.getItem(TOKEN);
    }

    async getToken(): String {
        try {
            const token = await FCM.getFCMToken();
            if (token) {
                await BackendApi.sendFcmToken(token);
                console.log(token);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async updateToken(token) {
        try {
            await BackendApi.sendFcmToken(token);
            AsyncStorage.setItem(TOKEN, token);
        } catch (e) {
            console.log(e);
        }
    }
}

export const notificationService = new NotificationService();
