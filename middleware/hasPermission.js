const Role = require('../models/Role')
const User = require('../models/Users')

const hasPermission = async (req, res, next) => {
    

    
    const { id } = req.user    
    
    const user = await User.findOne({ where: { id: id }}).catch(error => {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
    })

    // if(false){
    if(user.suAdmin){
        next()
    }
    else{
        const route = definirRuta(req)
            //obtener la ruta del request
        await Role.findOne({ where: { id: user.tipoUsuario_id } }).then(role => {
            return role.getPermisos()
        }).then(permisos => {
            return permisos.map(permiso => {
                return permiso.permiso
            })
        }).then( permisos => {
            if(permisos.includes(route)){
                next()
            }
            else{
                res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
            }
        }
        ).catch(error => {
            res.status(500).json({ message: 'Error del servidor', error: error.message })
        })
    }
}

const definirRuta = (req) => {
    const { originalUrl } = req
    const { method } = req
    let route = originalUrl.replace('/api', '')
    route = route.replace(/\/$/, '').replace(/\/\d+$/, '')
    switch (method) {
        case 'GET':
            // agregar "ver" entre la / y el nombre de la ruta
            route = route.replace('/', '/ver-')
            break;
        case 'POST':
            route = route.replace('/', '/crear')
            break;
        case 'PUT':
            route = route.replace('/', '/editar-')
            break;
        case 'DELETE':
            route = route.replace('/', '/eliminar-')
            break;
        default:
            break;
    }
    return route

}
        


module.exports = hasPermission