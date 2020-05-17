import { expect } from "chai";
import { PPApp } from "../pages/application";
var faker = require("faker");
var app = new PPApp();
var fakeData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    country: app.getRandomCountry(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: "Qwerty1!",
    org: app.randomOrganization(),
    title: faker.lorem.word(),
    certs: faker.lorem.sentence()
}

describe('Authorization', function() {
    beforeEach(function () {
        browser.reset();
    });

    it("Displaying login screen", function() {
        app.login.waitForOpening();
        expect(app.login.usernameField().getText()).to.be.equal("Username");
        expect(app.login.passwordField().getText()).to.be.equal("Password");
        expect(app.login.loginButton().element("android.widget.TextView").getText()).to.be.equal("Sign In");
        expect(app.login.signUpButton().element("android.widget.TextView").getText()).to.be.equal("Create Account");
        expect(app.login.resetPassButton().element("android.widget.TextView").getText()).to.be.equal("Forgot Password");
        expect(app.login.termsOfUse().getText()).to.be.equal("By signing up, you agree with the Terms of Service and Privacy Policy");
    });

    it("Displaying sign up screen", function() {
        app.login.waitForOpening();
        app.login.goToSignUp();
        app.signUp.waitForOpening();
        expect(app.signUp.getLabel(app.signUp.fields.firstName).getText()).to.be.equal("* First Name");
        expect(app.signUp.getLabel(app.signUp.fields.lastName).getText()).to.be.equal("* Last Name");
        expect(app.signUp.getLabel(app.signUp.fields.countryPicker).getText()).to.be.equal("* Country of Citizenship");
        expect(app.signUp.getLabel(app.signUp.fields.email).getText()).to.be.equal("* Email");
        expect(app.signUp.getLabel(app.signUp.fields.username).getText()).to.be.equal("* Username");
        expect(app.signUp.getLabel(app.signUp.fields.password).getText()).to.be.equal("* Password");
        expect(app.signUp.getLabel(app.signUp.fields.passwordConfirm).getText()).to.be.equal("* Confirm Password");
        expect(app.signUp.getLabel(app.signUp.fields.organization).getText()).to.be.equal("* Organization");
        expect(app.signUp.getLabel(app.signUp.fields.title).getText()).to.be.equal("Title");
        expect(app.signUp.getLabel(app.signUp.fields.certifications).getText()).to.be.equal("Certifications");
        expect(app.signUp.submitButton().element("android.widget.TextView").getText()).to.be.equal("Create Account");
        expect(app.signUp.goToSignInButton().getText()).to.be.equal("Already have an Account?");
        expect(app.signUp.termsOfUse().getText()).to.be.equal("By signing up, you agree with the Terms of Service and Privacy Policy");
    });

    it("Displaying sign up screen errors", function() {
        app.login.waitForOpening();
        app.login.goToSignUp();
        app.signUp.waitForOpening();
        app.signUp.submitButton().click();
        expect(app.signUp.getInputError(app.signUp.fields.firstName).getText()).to.be.equal("First name can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.lastName).getText()).to.be.equal("Last name can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.countryPicker).getText()).to.be.equal("Country can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.email).getText()).to.be.equal("Email can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.username).getText()).to.be.equal("Username can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.password).getText()).to.be.equal("Password can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.passwordConfirm).getText()).to.be.equal("Confirm password can not be empty");
        expect(app.signUp.getInputError(app.signUp.fields.organization).getText()).to.be.equal("Organization can not be empty");
    });

    it("Displaying reset password screen", function() {
        app.login.waitForOpening();
        app.login.goToResetPass();
        app.resetPass.waitForOpening();
        expect(app.resetPass.pageTitle().getText()).to.be.equal("RESET PASSWORD");
        expect(app.resetPass.emailLabel().getText()).to.be.equal("* Email");
        expect(app.resetPass.resetPasswordButton().element("android.widget.TextView").getText()).to.be.equal("Send me a reset link");
        expect(app.resetPass.cancelButton().element("android.widget.TextView").getText()).to.be.equal("Cancel");
        app.resetPass.resetPasswordButton().click();
        expect(app.resetPass.emailInputFieldError().getText()).to.be.equal("Email can not be empty");
        app.resetPass.emailInputField().setValue("test");
        app.resetPass.resetPassword();
        expect(app.resetPass.emailInputFieldError().getText()).to.be.equal("Enter valid email address");
    });

    it("Register new account", function() {
        app.login.waitForOpening();
        app.login.goToSignUp();
        app.signUp.waitForOpening();
        app.signUp.getInputField(app.signUp.fields.firstName).setValue(fakeData.firstName);
        app.signUp.getInputField(app.signUp.fields.lastName).setValue(fakeData.lastName);
        app.signUp.getCountryPicker().click();
        app.signUp.selectCountry(fakeData.country);
        app.signUp.confirmCountry();
        app.signUp.getInputField(app.signUp.fields.email).setValue(fakeData.email);
        app.signUp.getInputField(app.signUp.fields.username).setValue(fakeData.username);
        app.signUp.getInputField(app.signUp.fields.password).setValue(fakeData.password);
        app.signUp.getInputField(app.signUp.fields.passwordConfirm).setValue(fakeData.password);
        app.signUp.getInputField(app.signUp.fields.organization).setValue(fakeData.org);
        app.signUp.getInputField(app.signUp.fields.title).setValue(fakeData.title);
        app.signUp.getInputField(app.signUp.fields.certifications).setValue(fakeData.certs);
        app.signUp.submit();
        expect(browser.alertText()).to.be.equal("Success\nYour account was successfully created. Please confirm your email to login.");
        browser.alertAccept();
    });

    it("Authorize not activated user", function() {
        app.login.waitForOpening();
        app.login.usernameField().setValue(fakeData.username);
        app.login.passwordField().setValue(fakeData.password);
        app.login.loginButton().click();
        app.login.waitForAlert();
        expect(browser.alertText()).to.be.equal("Error\nPlease confirm your email");
        browser.alertAccept();
    });

    it("Try to reset password for not activated user", function() {
        app.login.waitForOpening();
        app.login.goToResetPass();
        app.resetPass.waitForOpening();
        app.resetPass.emailInputField().setValue(fakeData.email);
        app.resetPass.resetPasswordButton().click();
        app.resetPass.waitForAlert();
        expect(browser.alertText()).to.be.equal("Error\nPlease confirm your email");
        browser.alertAccept();
        expect(app.mail.getResetPasswordLink(fakeData.email), 'Reset password email should not exist').to.be.null;
    });

    it("Activate user and authorize", function() {
        expect(app.mail.activateUser(fakeData.email)).to.be.true;
        app.login.waitForOpening();
        app.login.usernameField().setValue(fakeData.username);
        app.login.passwordField().setValue(fakeData.password);
        app.login.loginButton().click();
        app.mainScreen.waitForOpening();
    });

    it("Try to reset password for new user and get reset link", function () {
        app.login.waitForOpening();
        app.login.goToResetPass();
        app.resetPass.waitForOpening();
        app.resetPass.emailInputField().setValue(fakeData.email);
        app.resetPass.resetPasswordButton().click();
        app.resetPass.waitForAlert();
        expect(browser.alertText()).to.be.equal("Success\nPlease check your email");
        browser.alertAccept();
        expect(app.mail.getResetPasswordLink(fakeData.email), 'Missed the reset password link').to.be.exist;
    });

    it("Login without username", function() {
        app.login.waitForOpening();
        app.login.passwordField().setValue(fakeData.password);
        app.login.loginButton().click();
        expect(app.login.usernameValidationError().getText()).to.be.equal("Username can not be empty");
    });

    it("Login without password", function() {
        app.login.waitForOpening();
        app.login.usernameField().setValue(fakeData.username);
        app.login.loginButton().click();
        expect(app.login.passwordValidationError().getText()).to.be.equal("Password can not be empty");
    });

    it("Login without username and password", function() {
        app.login.waitForOpening();
        app.login.loginButton().click();
        expect(app.login.usernameValidationError().getText()).to.be.equal("Username can not be empty");
        expect(app.login.passwordValidationError().getText()).to.be.equal("Password can not be empty");
    });

    it("Authorize with wrong user", function() {
        app.login.waitForOpening();
        app.login.usernameField().setValue("Test");
        app.login.passwordField().setValue("testoff");
        app.login.loginButton().click();
        app.login.waitForAlert();
        expect(browser.alertText()).to.be.equal("Error\nInvalid Login");
        browser.alertAccept();
    });

});