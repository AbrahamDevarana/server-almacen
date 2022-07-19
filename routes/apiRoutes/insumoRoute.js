const router = require('express').Router()
const { check } = require('express-validator')
const insumoController = require('../../controllers/insumoController')


router.get('/', insumoController.getInsumos)
router.get('/:id', insumoController.getInsumo)
router.post('/', [
    check('nombre').not().isEmpty(),
    check('claveEnk').not().isEmpty(),
    check('centroCosto').not().isEmpty(),
    check('unidadMedida').not().isEmpty(),
    check('status').not().isEmpty(),
    ], insumoController.createInsumo )

router.put('/:id', [
    check('nombre').not().isEmpty(),
    check('claveEnk').not().isEmpty(),
    check('centroCosto').not().isEmpty(),
    check('unidadMedida').not().isEmpty(),
    check('status').not().isEmpty(),
    ], insumoController.updateInsumo )

router.delete('/:id', insumoController.deleteInsumo )

router.post('/massiveUpload', insumoController.massiveUpload)

module.exports = router