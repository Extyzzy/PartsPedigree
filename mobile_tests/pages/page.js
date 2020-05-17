export const SELECTOR_TYPE = {
    id: 'resourceId',
    class: 'className',
    access: 'description'
}

export class Page {

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    idSelector(name) {
        return `android=new UiSelector().resourceId("${name}")`;
    }

    scrollSelector(scroll_selector_type, scroll_val, selector_type, val) {
        return `android=new UiScrollable(new UiSelector().${scroll_selector_type}(\"${scroll_val}\")).scrollIntoView(new UiSelector().${selector_type}(\"${val}\"));`;
    }

    waitForAlert(){
        let selector = this.idSelector('android:id/alertTitle');
        return browser.waitForVisible(selector);
    }
}