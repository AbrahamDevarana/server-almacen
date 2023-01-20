const jwt = require('../services/jwtStrategy')
const moment = require('moment')
const Users = require('../models/Users')
const bcrypt = require('bcrypt')

exports.getAccessToken = (req, res) => {
    if (req.user){
        const accessToken = jwt.createAccessToken(req.user)
        const refreshToken = jwt.createRefreshToken(req.user)

        res.status(200).json({
            accessToken,
            refreshToken
        })
    }else{
        res.status(401).json({ message: "Error al iniciar sesión" })
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


exports.loginWithPassword = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) return res.status(400).json({ message: 'Debes ingresar un email y una contraseña' })

    // if(email.match(/@devarana.mx/)) return res.status(400).json({ message: 'Debes iniciar sesión con tu cuenta de Google' })

    try {
        const user = await Users.findOne({ where: { email }, attributes: ['id', 'email', 'password', 'esInterno'] })
        if(user){
            const isPasswordValid = bcrypt.compareSync(password, user.dataValues.password)
            if(isPasswordValid){
                delete user.dataValues.password
                const accessToken = jwt.createAccessToken(user)
                const refreshToken = jwt.createRefreshToken(user)
                res.status(200).json({
                    accessToken,
                    refreshToken
                })
            } else {
                res.status(401).json({ message: 'Contraseña incorrecta' })
            }
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al iniciar sesión' })
    }
}