const router = require('express').Router()
const { check } = require('express-validator')
const insumoController = require('../../controllers/insumoController')
const checkAccess = require('../../middleware/checkAccess')


router.get('/', insumoController.getInsumos)
router.get('/:id', checkAccess('editar insumos'), insumoController.getInsumo)
router.post('/',  checkAccess('crear insumos'),
    [
        check('nombre').not().isEmpty(),
        check('claveEnk').not().isEmpty(),
        check('centroCosto').not().isEmpty(),
        check('unidadMedida').not().isEmpty(),
        check('status').not().isEmpty(),
    ], insumoController.createInsumo )

router.put('/:id', checkAccess('editar insumos'),
    [
        check('nombre').not().isEmpty(),
        check('claveEnk').not().isEmpty(),
        check('centroCosto').not().isEmpty(),
        check('unidadMedida').not().isEmpty(),
        check('status').not().isEmpty(),
    ], insumoController.updateInsumo )

router.delete('/:id', checkAccess('eliminar insumos'), insumoController.deleteInsumo )

router.post('/massiveUpload', checkAccess('crear insumos'), insumoController.massiveUpload)

module.exports = router