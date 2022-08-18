const router = require('express').Router()
const { check } = require('express-validator')
const userController = require('../../controllers/userController')
const checkAccess = require('../../middleware/checkAccess')


router.get('/', userController.getUsers)
router.get('/:id', checkAccess('editar usuarios'), userController.getUser)
router.post('/', checkAccess('crear usuarios'), 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
        check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
        check('tipoUsuario_id').not().isEmpty().withMessage('El tipo de usuario es requerido'),
        check('puesto').not().isEmpty().withMessage('El puesto es requerido')
    ], userController.createUser )

router.put('/:id', checkAccess('editar usuarios'), 
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
        check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
        check('tipoUsuario_id').not().isEmpty().withMessage('El tipo de usuario es requerido'),
        check('puesto').not().isEmpty().withMessage('El puesto es requerido')
    ], userController.updateUser )

router.delete('/:id', checkAccess('eliminar usuarios'), userController.deleteUser)

module.exports = router