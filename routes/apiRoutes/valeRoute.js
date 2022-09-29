const router = require('express').Router()
const { check } = require('express-validator')
const valeController = require('../../controllers/valeSalidaController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', valeController.getAllValeSalida)
router.get('/search', valeController.getValeSalida)
router.get('/countVales', valeController.getCountValeSalida)



router.post('/', checkAccess('crear vales'),
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


// Entregas 
router.post('/deliver', checkAccess('entregar vales'), valeController.deliverValeSalida)
router.post('/registrarVale', checkAccess('registrar vales'), valeController.registrarValeSalida)
router.post('/completeVale', checkAccess('entregar vales'), valeController.completeValeSalida)

router.post('/cancelVale', checkAccess('eliminar vales'), valeController.cancelValeSalida)
router.post('/cancelDetalle', checkAccess('eliminar vales'), valeController.cancelDetalleSalida)


router.get('/paginate', valeController.paginateAllVales )



module.exports = router
