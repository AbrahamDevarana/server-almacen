const router = require('express').Router()
const { check } = require('express-validator')
const valeController = require('../../controllers/valeSalidaController')

router.get('/', valeController.getAllValeSalida)
router.get('/search', valeController.getValeSalida)
router.post('/',
    [
        check('almacenId').not().isEmpty(),
        check('obraId').not().isEmpty(),
        check('nivelId').not().isEmpty(),
        check('zonaId').not().isEmpty(),
        check('actividadId').not().isEmpty(),
        check('personalId').not().isEmpty(),
        check('statusVale').not().isEmpty(),
    ], valeController.createValeSalida )


router.put('/:id', valeController.updateValeSalida )

router.post('/deliver', valeController.deliverValeSalida)


router.post('/cancelVale', valeController.cancelValeSalida)
router.post('/cancelDetalle', valeController.cancelDetalleSalida)
router.post('/closeVale', valeController.closeValeSalida)
router.post('/completeVale', valeController.completeValeSalida)

module.exports = router
