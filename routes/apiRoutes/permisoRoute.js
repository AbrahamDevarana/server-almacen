const router = require('express').Router()
const permisoController = require('../../controllers/permisoController')

router.get('/', permisoController.getPermisos)
router.get('/usuario', permisoController.getPermisoUsuario)
router.get('/:id', permisoController.getPermiso)
router.post('/', permisoController.createPermiso)
router.put('/:id', permisoController.updatePermiso)

module.exports = router