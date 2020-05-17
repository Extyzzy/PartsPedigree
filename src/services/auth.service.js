import { AsyncStorage } from 'react-native';
import BackendApi from "./backend";

const TOKEN = 'auth:token';

export class AuthService {
    static setToken(token) {
        return AsyncStorage.setItem(TOKEN, token);
    }

    static getToken() {
        return AsyncStorage.getItem(TOKEN);
    }

    static isAuthorized() {
        return AsyncStorage.getItem(TOKEN).then(token => !!token);
    }

    static async logout() {
        await BackendApi.logout();
        return AsyncStorage.removeItem(TOKEN);
    }
}