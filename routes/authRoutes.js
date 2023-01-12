const router = require('express').Router()
const isUserAuthenticated = require('../middleware/loginWithGoogle')
const authController = require('../controllers/authController')
const jwt = require('../services/jwtStrategy');
require('dotenv').config()


router.get(
    '/logout', 
    (req, res) => {
        res.clearCookie('dev-session')
        req.session.destroy(null)
        req.session = ''
        res.status(200).json({ message: 'Has cerrado sesión correctamente'})
    }
)

router.get(
    '/',
    isUserAuthenticated,
    (req, res) => {
        if(req.user){
            const accessToken = jwt.createAccessToken(req.user);
            const refreshToken = jwt.createRefreshToken(req.user);
            res.status(200).json({ 
                accessToken,
                refreshToken
            });
        }else{
            res.status(401).json({ msg: 'Debes iniciar sesión primero' })
        }
    }
)

router.post('/login', authController.loginWithPassword)


router.post('/refresh-access-token', authController.refreshAccessToken)
module.exports = router