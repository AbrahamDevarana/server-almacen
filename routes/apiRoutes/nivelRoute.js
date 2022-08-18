const router = require('express').Router()
const { check } = require('express-validator')
const nivelController = require('../../controllers/nivelController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', nivelController.getNiveles)

router.get('/:id', checkAccess('editar niveles'), nivelController.getNivel)

router.post('/', checkAccess('crear niveles'),
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('status').not().isEmpty().withMessage('El status es requerido')
    ], nivelController.createNivel)

router.put('/:id', checkAccess('editar niveles'),
    [
        check('nombre').not().isEmpty().withMessage('El nombre es requerido'),
        check('status').not().isEmpty().withMessage('El status es requerido')
    ], nivelController.updateNivel)

router.delete('/:id', checkAccess('eliminar niveles'), nivelController.deleteNivel)

module.exports = router
