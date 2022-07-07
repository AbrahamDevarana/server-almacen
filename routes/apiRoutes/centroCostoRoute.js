const router = require('express').Router()
const { check } = require('express-validator')
const centroCosto = require('../../controllers/centroCostoController')

router.get('/', centroCosto.getCentrosCosto)
router.get('/:id', centroCosto.getCentroCosto)
router.post('/', [check('nombre').not().isEmpty()], centroCosto.createCentroCosto)
router.put('/:id', [check('nombre').not().isEmpty()], centroCosto.updateCentroCosto)
router.delete('/:id', centroCosto.deleteCentroCosto)

module.exports = router
