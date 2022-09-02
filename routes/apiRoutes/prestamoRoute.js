const router = require('express').Router()
const { check } = require('express-validator')
const prestamoController = require('../../controllers/prestamoController')

router.get('/', prestamoController.getAllPrestamos)
router.get('/all', prestamoController.getAllPrestamos)

// router.post('/',
//     [
//         check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
//         check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
//         check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
//     ], prestamoController.createPersonal)


router.put('/', 
[
    check('id').not().isEmpty().withMessage('El id es requerido'),
    check('action').not().isEmpty().withMessage('La accion es requerida')
], prestamoController.updatePrestamo)


module.exports = router