const router = require('express').Router()
const { check } = require('express-validator')
const unidadController = require('../../controllers/unidadController')

router.get('/', unidadController.getUnidades)
router.get('/:id', unidadController.getUnidad)
router.post('/', 
    [
        check('nombre').not().isEmpty(),
        check('nombreCorto').not().isEmpty(),
        check('status').not().isEmpty()
    ], 
unidadController.createUnidad)
router.put('/:id', 
    [
        check('nombre').not().isEmpty(),
        check('nombreCorto').not().isEmpty(),
        check('status').not().isEmpty()
    ], unidadController.updateUnidad)
router.delete('/:id', unidadController.deleteUnidad)


module.exports = router
