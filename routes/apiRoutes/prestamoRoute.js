const router = require('express').Router()
const { check } = require('express-validator')
const prestamoController = require('../../controllers/prestamoController')

router.get('/', prestamoController.getAllPrestamos)

// router.post('/',
//     [
//         check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
//         check('apellidoPaterno').not().isEmpty().withMessage('El apellido paterno es requerido'),
//         check('especialidad').not().isEmpty().withMessage('La especialidad es requerida')
//     ], prestamoController.createPersonal)




module.exports = router