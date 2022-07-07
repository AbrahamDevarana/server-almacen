const router = require('express').Router()
const { check } = require('express-validator')
const actividadController = require('../../controllers/actividadController')

router.get('/', actividadController.getActividades)
router.get('/:id', actividadController.getActividad)
router.post('/', [check('nombre').not().isEmpty()], actividadController.createActividad)
router.put('/:id', [check('nombre').not().isEmpty()], actividadController.updateActividad)
router.delete('/:id', actividadController.deleteActividad)


module.exports = router
