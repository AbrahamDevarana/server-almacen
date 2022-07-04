const router = require('express').Router()
const passport = require('passport')
const isUserAuthenticated = require('../middleware/loginWithGoogle')
const authController = require('../controllers/authController')
require('dotenv').config()


router.get('/validate', isUserAuthenticated, authController.getAccessToken)

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
        successRedirect: process.env.CLIENT_URL + '/success'
    }),
    (req, res) => {
        console.log('[Callback Login]', req.user);
        res.status(200).json({message: 'Has iniciado sesión correctamente'})
    }
)

module.exports = router