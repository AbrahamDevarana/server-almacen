const passport = require('passport');

const requireJwtAuth = passport.authenticate('jwt', { session: false });

module.exports = requireJwtAuth;

const jwt = require('jsonwebtoken')
const Users = require('../models/Users')


module.exports = (req, res, next) => {
    const token = req.header('accessToken')
    if ( !token ) return res.status(401).json( { error: { msg: "Accesso no autorizado!!" } } )

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
              return res.status(401).json({ msg: 'Token no valido' });
            } else {
                req.user = decoded;
                const user = await Users.findOne({ where: { id: req.user.id } })
                    if(!user) return res.status(401).json({ msg: 'Token inexistente' })
                next();
            }
        })
    } catch (error) {
        res.status(400).json({ error: {msg: 'Token no valido' } })
    }
}

