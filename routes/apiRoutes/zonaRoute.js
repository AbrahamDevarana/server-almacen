const router = require('express').Router()
const { check } = require('express-validator')
const zonaController = require('../../controllers/zonaController')

router.get('/', zonaController.getZonas)
router.get('/:id', zonaController.getZona)
router.post('/', [check('nombre').not().isEmpty()], zonaController.createZona)
router.put('/:id', [check('nombre').not().isEmpty()], zonaController.updateZona)
router.delete('/:id', zonaController.deleteZona)

module.exports = router
