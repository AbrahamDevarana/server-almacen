const Users = require('../models/Users')
require('dotenv').config()

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy


const googleLogin = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
    }, async ( req, accessToken, refreshToken, profile, cb) => {
        const email = profile.emails[0].value

        const user = await Users.findOne({ where: { email: email } }).catch( err => {
            console.log('Error Login', err);
            return cb(err, null)
        })
        console.log('User', user.dataValues);
        if( user.dataValues ) {
            return cb(null, user.dataValues)
        }
})

passport.serializeUser( (user, cb) => {
    return cb(null, user.id)
})

passport.deserializeUser( async (id, cb) => {
    const user = await Users.findOne({ where: {id}}).catch( err => {
        console.log('DeserializeUser Error', err );
        return cb (err, null)
    })

    if(user){
        return cb (null, err)
    }
})


passport.use(googleLogin);