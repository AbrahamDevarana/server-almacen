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
const permisoRoute = require('./apiRoutes/permisoRoute')

const hasPermission = require('../middleware/hasPermission')

router.use('/usuarios', hasPermission, userRoute)
router.use('/roles', hasPermission, roleRoute)
router.use('/actividades', hasPermission, actividadRoute)
router.use('/niveles', hasPermission, nivelRoute)
router.use('/zonas', hasPermission, zonaRoute)
router.use('/unidades', hasPermission, unidadRoute)
router.use('/obras', hasPermission, obraRoute)
router.use('/personal', hasPermission, personalRoute)
router.use('/insumos', hasPermission, insumoRoute)
router.use('/vales', hasPermission, valeRoute)
router.use('/permisos', permisoRoute)


module.exports = router