const router = require('express').Router()
const reportesController = require('../../controllers/reportesController')

router.get('/', reportesController.getReportesAcumulados)
router.get('/general', reportesController.getReporteGeneral)


module.exports = router

