const router = require('express').Router()
const { check } = require('express-validator')
const roleController = require('../../controllers/roleController')

router.get('/', roleController.getRoles)
router.get('/:id', roleController.getRole)

router.post('/', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('descripcion').not().isEmpty().withMessage('La descripción es requerida'),
    check('status').not().isEmpty().withMessage('El status es requerido'),

], roleController.createRole)

router.put('/:id', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('descripcion').not().isEmpty().withMessage('La descripción es requerida'),
    check('status').not().isEmpty().withMessage('El status es requerido'),
], roleController.updateRole)

router.delete('/:id', roleController.deleteRole)

module.exports = router