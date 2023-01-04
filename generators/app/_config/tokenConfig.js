module.exports = {
    options: {
        // Options for module express-jwt
        //The "iss" (issuer) claim identifies the principal that issued the JWT.
        issuer: "<issuer>",   // >> iss

        authType: "bearer",
        algorithm: "HS512",
        requestProperty: 'Authorization',
        algorithms: ['HS512'],
        //The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT
        //  be accepted for processing.
        expiresIn: "4h" //>>exp  NumericDate
        //The "aud" (audience) claim identifies the recipients that the JWT is intended for.
        // Each principal intended to process the JWT MUST identify itself with a value in the audience claim.
        //audience >> aud



        //jwtid
        //The "sub" (subject) claim identifies the principal that is the subject of the JWT.
        //subject >> sub
        //notBefore  >> nbf
        //noTimestamp  >> if present, iat is not generated, otherwise iat is generated automatically
    },
    AnonymousToken : "<token>"
};
