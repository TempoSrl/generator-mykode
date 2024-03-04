/**
 * @module LocalResourceEn
 * @description
 * Collection of the localized strings ENGLISH app segreterie
 */
(function () {


    const LocFr = {
        pwdNotMatch: "Attention, le mot de passe ne correspond pas",
        compileAllFields: "Remplissez tous les champs !",
        waitForTheRegistration: "Enregistrement en cours",
        clickOnTheMailToVerifyIdentity: "Avant de procéder à la connexion, confirmez votre identité en cliquant sur le lien que nous avons envoyé à votre adresse e-mail !",
        thereWereProblemsWithTheregistration: "Il y a eu un problème lors de l'inscription",
        loginRunning: "Connexion en cours...",
        menuLoading: "Chargement du menu",
        toast_login_success: "Connexion réussie",
        toast_reg_success: "Inscription réussie",
        info_not_avalilable: "Informations de ligne non disponibles pour cet objet",

        // Keys for appMain controls
        menu_search_btn_id: "Rechercher",
        menu_info_btn_id: "Info",
        menu_guide_btn_id: "Guide",
        logoutButton: 'Déconnexion',
        loginButton: 'Se connecter',
        gotoLogin_id: 'Se connecter',
        gotoRegister_id: 'S\'inscrire',
        resetPwdMailId: 'Mot de passe oublié ?',
    };


    appMeta.Localization.prototype.addSupportedLanguage("fr", LocFr) ;
}());


