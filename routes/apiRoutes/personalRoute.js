const router = require('express').Router()
const { check } = require('express-validator')
const personalController = require('../../controllers/personalController')


router.post('/', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
    check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
    check('fechaIngreso').not().isEmpty().withMessage('La fecha de ingreso es requerida'),
    check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
], personalController.createPersonal)

router.put('/:id', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
    check('apellidoMaterno').not().isEmpty().withMessage('El apellido materno es requerido'),
    check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
], personalController.updatePersonal)

router.get('/:id', personalController.getPersonal)
router.get('/', personalController.getAllPersonal)
router.delete('/:id', personalController.deletePersonal)


module.exports = router