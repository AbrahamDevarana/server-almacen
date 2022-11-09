const router = require('express').Router()
const reportesController = require('../../controllers/reportesController')

router.get('/', reportesController.getReportesAcumulados)
router.get('/general', reportesController.getReporteGeneral)

router.get('/export-reporte-general', reportesController.generateReporteGeneral)
router.get('/export-reporte-acumulado', reportesController.generateReporteAcumulados)


router.get('/export-pdf', reportesController.generatePdf)


module.exports = router

