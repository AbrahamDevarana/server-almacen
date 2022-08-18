const Role = require('../models/Role')
const User = require('../models/Users')
const Permisos = require('../models/Permisos')

const checkAccess = (rule) => {
    return (req, res, next) => {
        const { id } = req.user
        User.findOne({ where: { id: id } }).then( async user => {
            // if (user.suAdmin) {
            //     next()
            // } else {
                await User.findOne({ where: { id }, include: [{ model: Role , include: Permisos }] })
                .then(user => { 
                    const hasAccess = user.role.permisos.some( item => item.permisos === rule)
                    if(hasAccess){
                        next()                    
                    }else{
                        res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
                    }
                })
                .catch(error => {
                    res.status(500).json({ message: 'Error al obtener los permisos', error: error.message })
                })
            // }
               
        }).catch(error => {
            res.status(500).json({ message: 'Error del servidor', error: error.message })
        }
        )
    }
}

module.exports = checkAccess;