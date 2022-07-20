const router = require('express').Router()
const { check } = require('express-validator')
const valeController = require('../../controllers/valeSalidaController')

router.get('/', valeController.getAllValeSalida)
router.get('/:id', valeController.getValeSalida)
router.post('/',
    [
        check('userId').not().isEmpty(),
        check('almacenId').not().isEmpty(),
        check('obraId').not().isEmpty(),
        check('nivelId').not().isEmpty(),
        check('zonaId').not().isEmpty(),
        check('actividadId').not().isEmpty(),
        check('personalId').not().isEmpty(),
        check('fecha').not().isEmpty(),
        check('statusVale').not().isEmpty(),
    ], valeController.createValeSalida )


router.put('/:id', valeController.updateValeSalida )

router.post('/deliver', valeController.deliverValeSalida)


module.exports = router
