const router = require('express').Router()
const { check } = require('express-validator')
const zonaController = require('../../controllers/zonaController')

router.get('/', zonaController.getZonas)

module.exports = router
