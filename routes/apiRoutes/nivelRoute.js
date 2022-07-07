const router = require('express').Router()
const { check } = require('express-validator')
const nivelController = require('../../controllers/nivelController')

router.get('/', nivelController.getNiveles)

router.get('/:id', nivelController.getNivel)

router.post('/', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('status').not().isEmpty().withMessage('El status es requerido')
], nivelController.createNivel)

router.put('/:id', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
    check('status').not().isEmpty().withMessage('El status es requerido')
], nivelController.updateNivel)

router.delete('/:id', nivelController.deleteNivel)

module.exports = router
