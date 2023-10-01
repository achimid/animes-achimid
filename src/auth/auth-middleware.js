const userService = require('../user/user-service')
const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require("passport-jwt").Strategy;

const { ExtractJwt } = require("passport-jwt");


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const preAuthHeader = (req, res, next) => {

    const authorizationHeader = req.headers['authorization']
    const authorizationCHeader = req.headers['X-Anifan-Token-JWT']
    const authorizationCookie = req.cookies['X-Anifan-Token-JWT']

    req.headers['authorization'] = authorizationHeader || authorizationCHeader || authorizationCookie

    next()
}

const auth = passport.authenticate('jwt', { session: false })

const configurePassport = (app) => {

    app.use(passport.initialize())

    passport.use(new GoogleStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                delete profile._raw
                delete profile._json

                const user = await userService.findById(profile.id)
                if (!user) await userService.create({ gAuth: profile })                
                
                return done(null, profile);
            } catch (error) {
                return done(error, false)
            }
        }
    ));

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromHeader("authorization"),
                secretOrKey: "secretKey",
            },
            async (jwtPayload, done) => {
                try {
                    const user = await userService.findById(jwtPayload.user.id)

                    done(null, user);
                } catch (error) {
                    done(error, false);
                }
            }
        ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}

const now = (unit) => {
    const hrTime = process.hrtime();

    switch (unit) {

        case 'milli':
            return hrTime[0] * 1000 + hrTime[1] / 1000000

        case 'micro':
            return hrTime[0] * 1000000 + hrTime[1] / 1000;

        case 'nano':
        default:
            return hrTime[0] * 1000000000 + hrTime[1];
    }
};

module.exports = {
    auth,
    preAuthHeader,
    configurePassport
}