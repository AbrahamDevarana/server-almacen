const router = require('express').Router()
const passport = require('passport')
const isUserAuthenticated = require('../middleware/loginWithGoogle')
const requireJwtAuth = require('../middleware/requireJwtAuth')
require('dotenv').config()


router.get(
    '/',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
)

router.get(
    '/callback',
    passport.authenticate('google', {
        failureMessage: 'Error al iniciar sesión, porfavor intenta más tarde',
        failureRedirect: process.env.CLIENT_URL + '/error',
        successFlash: process.env.CLIENT_URL + '/success'
    }),
    (req, res) => {
        console.log('[Callback Login]', req.user);
        res.status(200).json({message: 'Has iniciado sesión correctamente'})
    }
)

router.get(
    'logout', 
    (req, res) => {
        res.clearCookie('express')
        req.session.destroy(null)
        req.session = ''
        res.status(200).json({ message: 'Has cerrado sesión correctamente'})
    }
)



module.exports = router