const router = require('express').Router()
const etapaController = require('../../controllers/etapaController')

router.get('/', etapaController.getEtapas)
router.get('/:id', etapaController.getEtapa)
router.post('/', etapaController.createEtapa)
router.put('/:id', etapaController.updateEtapa)
router.delete('/:id', etapaController.deleteEtapa)

module.exports = router