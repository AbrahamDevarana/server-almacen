const jwt = require('../services/jwtStrategy')
const moment = require('moment')
const Users = require('../models/Users')


exports.getAccessToken = (req, res) => {
    if (req.user){
        const accessToken = jwt.createAccessToken(req.user)
        const refreshToken = jwt.createRefreshToken(req.user)

        res.status(200).json({
            accessToken,
            refreshToken
        })
    }else{
        res.status(401).json({ message: "Debes Iniciar Sesión Primero" })
    }
}

function willExpireToken (token) {
    const {expiresIn} = jwt.decodeToken(token)
    const currentDate = moment().unix()

    if(currentDate > expiresIn){
        return true
    }

    return false
}


exports.refreshAccessToken = async (req, res) => {

    const { refreshToken } = req.body
    const isTokenExpired = willExpireToken(refreshToken)

    if(isTokenExpired){
        return res.status(401).json({ message: 'El token ha expirado' })
    } else {
        const {id} = jwt.decodeToken(refreshToken)
        try {
            const user = await Users.findOne({ where: { id } })
        if(user){
            const accessToken = jwt.createAccessToken(user)
            res.status(200).json({
                accessToken,
                refreshToken
            })
        } else {
            res.status(401).json({ message: 'Usuario no encontrado' })
        }
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el usuario" })
        }
    }
}