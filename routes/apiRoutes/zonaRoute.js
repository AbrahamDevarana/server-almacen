const router = require('express').Router()
const { check } = require('express-validator')
const zonaController = require('../../controllers/zonaController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', zonaController.getZonas)
router.get('/:id', checkAccess('editar zonas'), zonaController.getZona)
router.post('/', checkAccess('crear zonas'),
    [ 
        check('nombre').not().isEmpty()
    ], zonaController.createZona )
router.put('/:id', checkAccess('editar zonas'),
    [
        check('nombre').not().isEmpty()
    ], zonaController.updateZona )

router.delete('/:id', checkAccess('eliminar zonas'), zonaController.deleteZona )

module.exports = router
