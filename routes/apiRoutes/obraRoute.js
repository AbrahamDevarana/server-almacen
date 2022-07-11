const router = require('express').Router()
const { check } = require('express-validator')
const obraController = require('../../controllers/obraController')

router.get('/', obraController.getObras)
router.get('/:id', obraController.getObra)
router.post('/', [check('nombre').not().isEmpty()], obraController.createObra)
router.put('/:id', [check('nombre').not().isEmpty()], obraController.updateObra)
router.delete('/:id', obraController.deleteObra)

module.exports = router
