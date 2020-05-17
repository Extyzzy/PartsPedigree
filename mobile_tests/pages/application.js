import { countries } from "./countries";
import { LoginScreen, ResetPassScreen, SignUpScreen } from "./authorization.page";
import { MailTrap } from "../helpers/mailtrap";
import { MainScreen } from "./main.page";

export class PPApp {
    constructor () {
        this.login = new LoginScreen();
        this.signUp = new SignUpScreen();
        this.resetPass = new ResetPassScreen();

        this.mainScreen = new MainScreen();

        this.mail = new MailTrap();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomCountry() {
        var i = this.getRandomInt(0, countries.length - 1);
        console.log("RandInt: ", i)
        return countries[i];
    }

    randomOrganization() {
        var organizations = [
            "Zero Inc",
            "Backer House",
            "Green Park",
            "Gross Inc",
            "Cyprus Ltd",
            "Google Corp",
            "MailRu Group",
            "Yahoo",
            "KROCK",
            "Innopolis CES"
        ]
        return organizations[this.getRandomInt(0, 9)]
    }
}