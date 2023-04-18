const router = require('express').Router()
const { check } = require('express-validator')
const empresaController = require('../../controllers/empresaController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', empresaController.getEmpresas)
router.get('/:id', checkAccess('editar empresas'), empresaController.getEmpresa)
router.post('/',  checkAccess('crear empresas'),
    [
        check('nombreCompleto').not().isEmpty(),
        check('nombreCorto').not().isEmpty(),
        check('rfc').not().isEmpty(),
        check('direccion').not().isEmpty(),
        check('telefono').not().isEmpty(),
        check('status').not().isEmpty(),
    ], empresaController.createEmpresa )
    
router.put('/:id', checkAccess('editar empresas'),
    [
        check('nombreCompleto').not().isEmpty(),
        check('nombreCorto').not().isEmpty(),
        check('rfc').not().isEmpty(),
        check('direccion').not().isEmpty(),
        check('telefono').not().isEmpty(),
        check('status').not().isEmpty(),

    ], empresaController.updateEmpresa )

router.delete('/:id', checkAccess('eliminar empresas'), empresaController.deleteEmpresa )

module.exports = router