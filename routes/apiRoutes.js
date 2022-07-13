const router = require('express').Router()
const userRoute = require('./apiRoutes/userRoute')
const roleRoute = require('./apiRoutes/roleRoute')
const nivelRoute = require('./apiRoutes/nivelRoute')
const actividadRoute = require('./apiRoutes/actividadRoute')
const zonaRoute = require('./apiRoutes/zonaRoute')
const unidadRoute = require('./apiRoutes/unidadRoute')
const obraRoute = require('./apiRoutes/obraRoute')
const personalRoute = require('./apiRoutes/personalRoute')
const insumoRoute = require('./apiRoutes/insumoRoute')
const valeRoute = require('./apiRoutes/valeRoute')

router.use('/usuarios', userRoute)
router.use('/roles', roleRoute)
router.use('/actividades', actividadRoute)
router.use('/niveles', nivelRoute)
router.use('/zonas', zonaRoute)
router.use('/unidades', unidadRoute)
router.use('/obras', obraRoute)
router.use('/personal', personalRoute)
router.use('/insumos', insumoRoute)
router.use('/vales', valeRoute)


module.exports = router