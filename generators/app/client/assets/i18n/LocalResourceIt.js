/**
 * @module LocalResourceEn
 * @description
 * Collection of the localized strings ENGLISH app segreterie
 */
(function () {


    const LocIt= {
        pwdNotMatch: "Attenzione la password non corrisponde",
        compileAllFields : "Compila tutti i campi!",
        waitForTheRegistration : "Registrazione in corso",
        clickOnTheMailToVerifyIdentity: "Prima di procedere con il login conferma la tua identità cliccando sul link che ti abbiamo inviato sulla tua mail!",
        thereWereProblemsWithTheregistration: "C'è stato qualche problema nella registrazione",
        loginRunning: "Login in corso...",
        menuLoading : "Caricamento menù",
		toast_login_success : "Login effettuata correttamente",
		toast_reg_success : "Registrazione avvenuta correttamente",
		info_not_avalilable : "Informazioni di riga non presenti per questo oggetto",


        // chiavi per controlli appMain
        menu_search_btn_id: "Cerca",
        menu_info_btn_id: "Info",
        menu_guide_btn_id: "Guida",
        logoutButton: 'Esci',
        loginButton: 'Accedi',
        gotoLogin_id: 'Accedi',
		gotoRegister_id: 'Registrati',
		resetPwdMailId: 'Password dimenticata?',


    };

    appMeta.Localization.prototype.addSupportedLanguage("it", LocIt) ;
}());


