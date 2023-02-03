const router = require('express').Router()
const proyectoController = require('../../controllers/proyectosController')

router.get('/', proyectoController.getProyectos)
router.get('/:id', proyectoController.getProyecto)
router.post('/', proyectoController.createProyecto)
router.put('/:id', proyectoController.updateProyecto)
router.delete('/:id', proyectoController.deleteProyecto)

module.exports = router