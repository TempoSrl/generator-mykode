/**
 * @module LocalResourceEn
 * @description
 * Collection of the localized strings in italian language (example)
 */
(function () {

    const LocEn = {
        pwdNotMatch: "Attention, the password does not match",
        compileAllFields: "Fill in all fields!",
        waitForTheRegistration: "Registration in progress",
        clickOnTheMailToVerifyIdentity: "Before proceeding with the login, confirm your identity by clicking on the link we sent to your email!",
        thereWereProblemsWithTheregistration: "There was an issue with the registration",
        loginRunning: "Logging in...",
        menuLoading: "Loading menu",
        toast_login_success: "Login successful",
        toast_reg_success: "Registration successful",
        info_not_avalilable: "Row information not available for this object",

        // Keys for appMain controls
        menu_search_btn_id: "Search",
        menu_info_btn_id: "Info",
        menu_guide_btn_id: "Guide",
        logoutButton: 'Logout',
        loginButton: 'Login',
        gotoLogin_id: 'Login',
        gotoRegister_id: 'Register',
        resetPwdMailId: 'Forgot Password?',
    };

    appMeta.Localization.prototype.addSupportedLanguage("en", LocEn) ;
}());


