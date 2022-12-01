const router = require('express').Router()
const bitacoraController = require('../../controllers/bitacoraController')


router.get('/', bitacoraController.getBitacoras)
router.get('/:id', bitacoraController.getBitacora)
router.post('/', bitacoraController.createBitacora)

router.post('/crearComentario', bitacoraController.createComentario)

module.exports = router