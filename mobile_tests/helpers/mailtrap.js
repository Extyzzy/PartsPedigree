var request = require("sync-request");

export class MailTrap {
    constructor(apiToken, inbox, baseUrl){
        this.apiToken = apiToken ? apiToken:"6d6b3ec08600896137e72fc0371d3d83";
        this.inbox = inbox ? inbox:352138;
        this.baseUrl = baseUrl ? baseUrl:"https://mailtrap.io/api/v1/";
        this.headers = {
            "Content-Type": "application/json",
            "Api-Token": this.apiToken
        };
    }

    getMessages(email){
        const res = request('GET', `${this.baseUrl}inboxes/${this.inbox}/messages`, {headers: this.headers});
        if (res.statusCode >= 400) {
            console.error("Response error:" + res.statusCode + " " + res.body);
            return [];
        }
        let messages = [];
        const result = JSON.parse(res.body);
        for (let i = 0, len = result.length; i < len; i++) {
            const item = result[i];
            if (email == null || item.to_email == email){
                messages.push(item);
            }
        }
        return messages;
    }

    getActivationLink(email){
        const regex = /http:\/\/[0-9.\/:?=_]*activation\?[0-9a-zA-Z.=_-]+/gm;
        const msg = this.getMessages(email)[0];
        const text = msg.html_body;
        const result = regex.exec(text);
        if (result.length !== 1){
            console.warn("Got incorrect number of activation links:", result);
        }
        return result[0];
    }

    getResetPasswordLink(email){
        const regex = /http:\/\/[0-9.\/:?=_]*reset-password\?[0-9a-zA-Z.=_-]+/gm;
        const msg = this.getMessages(email)[0];
        const text = msg.html_body;
        const result = regex.exec(text);
        if (!result){
            return null;
        }
        if (result.length !== 1){
            console.warn("Got incorrect number of activation links:", result);
        }
        return result[0];
    }

    activateUser(email){
        const link = this.getActivationLink(email);
        console.log("Got activation link: ", link);
        const res = request('GET', link);

        if (res.statusCode >= 400) {
            console.error("Response error:" + res.statusCode + " " + res.body);
            return false;
        }
        return true;
    }
}