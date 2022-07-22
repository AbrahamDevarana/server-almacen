const router = require('express').Router()
const permisoController = require('../../controllers/permisoController')

router.get('/', permisoController.getPermisos)
router.get('/:id', permisoController.getPermiso)

module.exports = router