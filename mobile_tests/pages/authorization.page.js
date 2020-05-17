import { Page, SELECTOR_TYPE } from "./page";
import { countries } from "./countries";

export class LoginScreen extends Page {
  
    waitForOpening() {
        return browser.waitForVisible("~Username", 20000);
    }

    usernameField() {
        return browser.element("~Username");
    }

    passwordField() {
        return browser.element("~Password");
    }

    usernameValidationError() {
        browser.waitForText("~Username Validation Error")
        return browser.element("~Username Validation Error");
    }

    passwordValidationError() {
        browser.waitForText("~Password Validation Error")
        return browser.element("~Password Validation Error");
    }
  
    loginButton(){
        return browser.element("~Sign In")
    }
  
    signUpButton(){
        return browser.element("~Create New Account");
    }
  
    resetPassButton(){
        return browser.element("~Forgot Password");
    }

    termsOfUse() {
        return browser.element("~Terms of Use text");
    }
  
    setUsernameAndPassword(username, password){
        this.usernameField().setValue(username);
        this.passwordField().setValue(password);
    }
  
    clickLogin(){
        this.loginButton().click();
    }
  
    goToSignUp(){
        this.signUpButton().click();
    }
  
    goToResetPass(){
        this.resetPassButton().click();
    }
  
    login(username, password){
        this.waitForOpening();
        this.setUsernameAndPassword(username, password);
        this.clickLogin();
    }
  };
  
  export class SignUpScreen extends Page {
  
    fields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      countryPicker: 'Country Picker',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      passwordConfirm: 'Password Confirm',
      organization: 'Organization',
      title: 'Title',
      certifications: 'Certifications'
    }

    scroll(access_name){
        var selector = this.scrollSelector(SELECTOR_TYPE.access, "Scroll", SELECTOR_TYPE.access, access_name);
        return browser.element(selector);
    }
  
    waitForOpening() {
        browser.waitForVisible("~Page Title: Create Account");
    }
  
    pageTitle() {
        return browser.element("~Page Title: Create Account");
    }
  
    getLabel(name) {
        return this.scroll(`${name} Label`)
    }
  
    getInputField(name) {
        return this.scroll(`${name} Input Field`)
    }

    getInputError(name) {
        return this.scroll(`${name} Input Field Error`)
    }
  
    getCountryPicker() {
        return browser.element("~Country picker");
    }
  
    selectCountry(country){
        var index = countries.indexOf(country),
            selector = this.idSelector('com.partspedigree.app:id/pickerViewAloneLayout');
        var element = browser.waitForVisible(selector);
        for (var i = 0; i < index; i++){
            console.log(i);
            var res = browser.swipe(selector, 0, 130, 5000);
        }
    }
  
    selectRandomCountry(){
      return this.selectCountry(this.getRandomCountry());
    }
    
    confirmCountry() {
        let selector = this.idSelector('com.partspedigree.app:id/confirm')
        browser.click(selector);
    }
    
    doNotConfirmCountry() {
        let selector = this.idSelector('com.partspedigree.app:id/cancel')
        browser.click(selector);
    }

    submitButton() {
        return this.scroll("Create Account");
    }
  
    submit() {
        this.submitButton().click();
        this.waitForAlert();
    }
  
    goToSignInButton() {
        return this.scroll("Already have an Account? Go to Sign In");
    }
  
    goToSignIn() {
        this.goToSignInButton().click();
    }

    termsOfUse() {
        return this.scroll("Terms of Use text");
    }
};
  
export class ResetPassScreen extends Page {
    pageTitle() {
        return browser.element("~Page Title: Reset Password");
    }
  
    waitForOpening() {
        browser.waitForVisible("~Page Title: Reset Password");
    }
  
    emailLabel() {
        return browser.element("~Email Label");
    }
  
    emailInputField() {
        return browser.element("~Email Input Field");
    }

    emailInputFieldError() {
        browser.waitForText("~Email Input Field Error");
        return browser.element("~Email Input Field Error")
    }
  
    resetPasswordButton() {
        return browser.element("~Reset Password");
    }
  
    cancelButton() {
        return browser.element("~Cancel");
    }
  
    resetPassword() {
        this.resetPasswordButton().click();
    }
  
    cancel() {
        this.cancelButton().click();
    }
}