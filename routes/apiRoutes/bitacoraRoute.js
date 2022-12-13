const router = require('express').Router()
const bitacoraController = require('../../controllers/bitacoraController')


router.get('/tipoBitacoras', bitacoraController.getTipoBitacoras)

router.get('/', bitacoraController.getBitacoras)
router.get('/:id', bitacoraController.getBitacora)
router.post('/', bitacoraController.createBitacora)

router.post('/crearComentario', bitacoraController.createComentario)
router.post('/generar-reporte', bitacoraController.generateReport)


module.exports = router