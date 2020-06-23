var onLoginRequest = function onLoginRequest(context) {

    var fedUser;
    executeStep(1,
        {
            onSuccess: function (context) {
                var idpName = context.steps[1].idp;

                // Only execute this flow when the user login from the google idp.
                // If you want to target all your idps you can use something like
                // idpName !== "LOCAL"
                if (idpName === "Facebook") {
                    fedUser = context.currentKnownSubject;

                    // Check is there is already a user association.
                    var assocUser = getAssociatedLocalUser(fedUser);
                    if (assocUser == null) {
                        var claimMap = {};

                        claimMap["http://wso2.org/claims/emailaddress"] = fedUser.remoteClaims.email;
                        // Get a unique user with same email given by the facebook account.
                        // getUniqueUserWithClaimValues(<claims to match the user>, <tenant domain>)
                        var storedLocalUser = getUniqueUserWithClaimValues(claimMap, "carbon.super");
                      
                        if (storedLocalUser !== null) {
                            // Prompt a screen showing info on the user association.
                            prompt("associationConsentForm", { "email": fedUser.remoteClaims.email }, {
                                onSuccess: function (context) {
                                    // Get the user decision to associate from the prompt.
                                    var decision = context.request.params.decision[0];
                                    if (decision === "yes") {
                                        // Perform basic authenticaion to confirm account ownership.
                                        executeStep(2,
                                            {
                                                onSuccess: function (context) {
                                                    // Get the authenticated user from basic authentication step.
                                                    var authUser = context.steps[2].subject;
                                                    
                                                    // Check whether authenticated user's email is equal to federated facebook user's email.
                                                    if (authUser.localClaims["http://wso2.org/claims/emailaddress"] === fedUser.remoteClaims.email) {
                                                       // Do the account linking with the local user account and the facebook account.
                                                       doAssociationWithLocalUser(fedUser, authUser.username, authUser.tenantDomain, authUser.userStoreDomain);
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });
};
