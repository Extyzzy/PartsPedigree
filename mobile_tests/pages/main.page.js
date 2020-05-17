import { Page, SELECTOR_TYPE } from "./page";

export class MainScreen extends Page {

    waitForOpening() {
        return browser.waitForVisible("~Add button", 20000);
    }
};