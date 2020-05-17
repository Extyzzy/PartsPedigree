//@flow
import { AuthService } from "../auth.service";
import { User } from "../../models/user";
import { StateService } from "../state.service";
import { notificationService } from "../notification.service";

export const userApi = {
    createNewUser(user: User) {

      user.citizenships = [
        ...user.citizenships.length && user.citizenships.map(data => data.countryId),
      ];

        return this.axios.post('/v1/users', user)
            .then(this.resHandler);
    },

    login(userCredentials: { username: string; password: string; }) {
        return this.axios.get('/v1/auth/login', { params: userCredentials })
            .then(this.resHandler)
            .then(data => {
                const { token } = data;

                this.setToken(token);
                return AuthService.setToken(token);
            })
    },

    async logout() {
        const fcm_token = await notificationService.getLocalToken();
        return this.axios.post('/v1/auth/logout', { fcm_token })
            .then(this.resHandler);
    },

    getCurrentUser(): Promise<User> {
        return this.axios.get('/v1/users/me')
            .then(this.resHandler)
            .then((res): { data: User } => {
                StateService.setUser(res.data);
                return res.data;
            });
    },

    saveUser(user: User) {
        const copyUser = JSON.parse(JSON.stringify(user));

        user.citizenships = [
        ...user.citizenships.length && user.citizenships.map(data => data.countryId),
        ];

        return this.axios.put('/v1/users/me', user)
            .then(this.resHandler)
            .then(() => {
                StateService.setUser(copyUser);
            });
    },

    requestResetPassword(email: string) {
        return this.axios.post('/v1/user/resetPassword', { email })
            .then(this.resHandler);
    },

    getCountryList() {
        return this.axios.get('/v1/user/country')
            .then(this.resHandler)
            .then(({ countries }) => StateService.setCountriesList(countries));
    },

    getOrganizationsList() {
        return this.axios.get('/v1/organizations')
            .then(this.resHandler)
            .then(({ organizations }) => StateService.setOrganization(organizations));
    },

    sendFcmToken(fcm_token: String) {
        return this.axios.put('/v1/users/me/fcm', { fcm_token })
            .then(this.resHandler);
    },

    getOrganizationAddress(organizationId: number) {
        return this.axios.get(`/v1/organizations/${organizationId}/address`)
            .then(this.resHandler)
            .then(({ addresses }) => StateService.setOrganizationAddress((addresses && addresses.length) ? addresses[0] : null));
    },

    getUserTags(query) {
        return this.axios.get(`/v1/userTags?query=${query}`)
            .then(this.resHandler)
            .then(({ tags }) => StateService.setTags(tags));
    },
    getTiff(attachmentId, id) {
        return this.axios.get(`v1/attachments/${attachmentId}/download`)
            .then(this.resHandler)
            .then((data) => StateService.setImageForFill(data));
    }
};