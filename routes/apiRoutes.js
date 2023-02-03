const router = require('express').Router()

router.use('/usuarios', require('./apiRoutes/userRoute'))
router.use('/roles', require('./apiRoutes/roleRoute'))
router.use('/actividades', require('./apiRoutes/actividadRoute'))
router.use('/niveles', require('./apiRoutes/nivelRoute'))
router.use('/zonas', require('./apiRoutes/zonaRoute'))
router.use('/obras', require('./apiRoutes/obraRoute'))
router.use('/personal', require('./apiRoutes/personalRoute'))
router.use('/insumos', require('./apiRoutes/insumoRoute'))
router.use('/vales', require('./apiRoutes/valeRoute'))
router.use('/permisos', require('./apiRoutes/permisoRoute'))
router.use('/notificaciones', require('./apiRoutes/notificacionRoute'))
router.use('/prestamos', require('./apiRoutes/prestamoRoute'))
router.use('/reportes', require('./apiRoutes/reportesRoute'))
router.use('/bitacora', require('./apiRoutes/bitacoraRoute'))
router.use('/etapas', require('./apiRoutes/etapaRoute'))
router.use('/empresas', require('./apiRoutes/empresaRoute'))
router.use('/proyectos', require('./apiRoutes/proyectosRoute'))



module.exports = router