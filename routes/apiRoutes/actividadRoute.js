const router = require('express').Router()
const { check } = require('express-validator')
const actividadController = require('../../controllers/actividadController')

router.get('/', actividadController.getActividades)

module.exports = router
