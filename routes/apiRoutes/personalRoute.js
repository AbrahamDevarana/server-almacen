const router = require('express').Router()
const { check } = require('express-validator')
const personalController = require('../../controllers/personalController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', personalController.getAllPersonal)
router.get('/:id', checkAccess('editar personal'), personalController.getPersonal)

router.post('/', checkAccess('crear personal'),
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
        check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
    ], personalController.createPersonal)

router.put('/:id', checkAccess('editar personal'),
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
        check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
    ], personalController.updatePersonal)

router.delete('/:id', checkAccess('eliminar personal'), personalController.deletePersonal)


module.exports = router