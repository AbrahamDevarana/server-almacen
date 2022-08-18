const router = require('express').Router()
const { check } = require('express-validator')
const roleController = require('../../controllers/roleController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', roleController.getRoles)
router.get('/:id', checkAccess('editar roles'), roleController.getRole)

router.post('/', checkAccess('crear roles'), 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('descripcion').not().isEmpty().withMessage('La descripción es requerida'),
        check('status').not().isEmpty().withMessage('El status es requerido'),

    ], roleController.createRole )

router.put('/:id', checkAccess('editar roles'),
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('descripcion').not().isEmpty().withMessage('La descripción es requerida'),
        check('status').not().isEmpty().withMessage('El status es requerido'),
    ], roleController.updateRole)

router.delete('/:id', checkAccess('eliminar roles'), roleController.deleteRole)

module.exports = router