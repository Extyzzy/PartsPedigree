import Axios from 'axios';
import mixin from "mixin-decorator"
import { AuthService } from "../auth.service";
import { Alert } from "react-native";
import { userApi } from './user.api';
import { partsApi } from './parts.api';
import { FileData } from "../../models/file-data";
import properties from '../../../properties';
import { eventApi } from "./event.api";
import { draftsApi } from "./drafts.api";
import { event81303Api } from "./event81303.api";
import { attachmentEventApi } from "./attachmentEvent.api";
import { notificationsApi } from "./notifications.api";
import { incomingShipmentsApi } from "./incomingShipments.api";
import { outBoundShipments } from "./outboundShipments.api";
import { followingListApi } from "./followingList.api";
import { StateService } from "../state.service";

const REST_URI = properties.baseUrl;

@mixin(
    userApi,
    partsApi, eventApi,
    draftsApi,
    event81303Api,
    attachmentEventApi,
    notificationsApi,
    incomingShipmentsApi,
    outBoundShipments,
    followingListApi,
)
class Rest {
    AUTH_HEADER = 'Authorization';
    baseUrl: string;
    axios: Axios;

    constructor(baseURL: string) {
        this.baseUrl = baseURL;
        this.axios = Axios.create({ baseURL, timeout: 20000 });

        AuthService.getToken().then(token => this.setToken(token));

        this.axios.interceptors.response.use(res => res, error => this.catchError(error));
    }

    setToken(token: string) {
        this.axios.defaults.headers.common[this.AUTH_HEADER] = token;
    }

    removeToken() {
        this.axios.defaults.headers.common[this.AUTH_HEADER] = null;
    }

    getReceiveReasons() {
        return this.axios.get('/v1/receivingreasons')
            .then(this.resHandler)
            .then(({ reasons }) => StateService.setReceiveReasons(reasons));
    }

    uploadImage(image: FileData, type: "user" | "partMaster", withDetection: boolean) {
        const urls = {
            user: 'v1/user/me/avatar',
            partMaster: 'v1/parts/images',
        };
        return AuthService.getToken()
            .then((token) => {
                const body = new FormData();
                body.append('image', image);

                if (withDetection) {
                    body.append('withDetection', true);
                }

                const headers = new Headers({
                    [this.AUTH_HEADER]: token,
                });

                return fetch(`${this.baseUrl}${urls[type]}`, {
                    method: 'post',
                    headers,
                    body,
                })
            })
            .then(res => res.json())
            .then(data => ({ data }))
            .then(res => this.resHandler(res, false))
            .catch(this.catchError);
    }

    uploadFile(file: FileData,  id: string, type: "item" | "event" = 'event') {
        return AuthService.getToken()
            .then((token) => {
                const body = new FormData();

                body.append('file', file);
                body.append('name', file.name);
                body.append('description', file.description);
                //body.append('tags', file.tags);

                file.tags.forEach(tag => body.append(`tags[]`, tag));

                body.append(type === 'event' ? 'eventDraftId' : 'shipItemId', Number(id));

                const headers = new Headers({
                    [this.AUTH_HEADER]: token,
                });

                return fetch(`${this.baseUrl}v1/attachments`, {
                    method: 'post',
                    headers,
                    body,
                });
            })
            .then(res => res.json())
            .then(data => ({ data }))
            .then(res => this.resHandler(res, false))
            .catch(this.catchError);
    }

    catchError(err) {
        if (err) {
            console.log(err);
            return new Promise((resolve, reject) => {
                Alert.alert('Error', err.message || error, [{
                    text: 'OK', onPress: () => reject()
                }]);
            });
        }
    }

    resHandler(res, logging: boolean = true) {
        return new Promise((resolve, reject) => {
            const { data } = res;

            if (data && data.status !== 200) {
                if (logging) {
                   return Alert.alert('Error', data.message || data.error || data, [{
                       text: 'OK', onPress: () => reject(data)
                   }]);
                }

                return reject(data);
            }

            return resolve(data);
        });
    }
}

export const BackendApi = new Rest(REST_URI);
export default BackendApi;
