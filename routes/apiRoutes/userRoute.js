const router = require('express').Router()
const { check } = require('express-validator')
const userController = require('../../controllers/userController')


router.get('/', userController.getUsers)
router.get('/:id', userController.getUser)
router.post('/', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
    check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
    check('tipoUsuario_id').not().isEmpty(),
    check('puesto_id').not().isEmpty()
], userController.createUser)

router.put('/:id', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
    check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
    check('tipoUsuario_id').not().isEmpty(),
    check('puesto_id').not().isEmpty()
], userController.updateUser)

router.delete('/:id', userController.deleteUser)

module.exports = router