const router = require('express').Router()
const { check } = require('express-validator')
const centroCosto = require('../../controllers/centroCostoController')

router.get('/', centroCosto.getCentrosCosto)

module.exports = router
