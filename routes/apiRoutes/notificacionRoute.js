const router = require('express').Router()
const notificacionController = require('../../controllers/notificacionController')

router.get('/', notificacionController.getNotificaciones)
router.put('/', notificacionController.updateNotificacion)

module.exports = router
