const router = require('express').Router()
const userRoute = require('./apiRoutes/userRoute')
const roleRoute = require('./apiRoutes/roleRoute')
const nivelRoute = require('./apiRoutes/nivelRoute')
const actividadRoute = require('./apiRoutes/actividadRoute')
const zonaRoute = require('./apiRoutes/zonaRoute')
const unidadRoute = require('./apiRoutes/unidadRoute')
const centroCostoRoute = require('./apiRoutes/centroCostoRoute')

router.use('/usuarios', userRoute)
router.use('/roles', roleRoute)


router.use('/actividades', actividadRoute)
router.use('/niveles', nivelRoute)
router.use('/zonas', zonaRoute)
router.use('/unidades', unidadRoute)
router.use('/centrosCosto', centroCostoRoute)


module.exports = router