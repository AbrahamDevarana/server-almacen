const jwt = require('jsonwebtoken');
const moment = require('moment');
const JWT_SECRET = process.env.JWT_SECRET;
require ('dotenv').config();


exports.createAccessToken = (user) => {
    const payload = {
        id: user.id,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        email: user.email,
        telefono: user.telefono,
        tipoUsuario_id: user.tipoUsuario_id,
        puesto_id: user.puesto_id,
        suAdmin: user.suAdmin,
        expiresIn: moment().add( 7 , 'days').unix(),
    }
    return jwt.sign(payload, JWT_SECRET);
}

exports.createRefreshToken = (user) => {
    const payload = {
        id: user.id,
        expiresIn: moment().add(30, 'days').unix(),
    }
    return jwt.sign(payload, JWT_SECRET);
}

exports.decodeToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
}


            