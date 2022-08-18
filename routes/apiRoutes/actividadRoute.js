const router = require('express').Router()
const { check } = require('express-validator')
const actividadController = require('../../controllers/actividadController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', actividadController.getActividades)
router.get('/:id', checkAccess('editar actividades'), actividadController.getActividad)
router.post('/', checkAccess('crear actividades'), 
    [
        check('nombre').not().isEmpty(),
        check('descripcion').not().isEmpty(),
        check('status').not().isEmpty()
    ], actividadController.createActividad )

router.put('/:id', checkAccess('editar actividades'), 
    [
        check('nombre').not().isEmpty(),
        check('descripcion').not().isEmpty(),
        check('status').not().isEmpty()
    ], actividadController.updateActividad)
    
router.delete('/:id', checkAccess('eliminar actividades'), actividadController.deleteActividad)


module.exports = router
