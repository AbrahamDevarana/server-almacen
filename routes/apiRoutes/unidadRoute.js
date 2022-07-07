const router = require('express').Router()
const { check } = require('express-validator')
const unidadController = require('../../controllers/unidadController')

router.get('/', unidadController.getUnidades)

module.exports = router
