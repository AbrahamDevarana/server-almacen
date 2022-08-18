const router = require('express').Router()
const { check } = require('express-validator')
const obraController = require('../../controllers/obraController')
const checkAccess = require('../../middleware/checkAccess')

router.get('/', obraController.getObras)
router.get('/:id', checkAccess('editar obras'),
    obraController.getObra
)
router.post('/', checkAccess('crear obras'),
    [ 
        check('nombre').not().isEmpty() 
    ], obraController.createObra )
router.put('/:id', checkAccess('editar obras'),
    [ 
        check('nombre').not().isEmpty() 
    ], obraController.updateObra )
    
router.delete('/:id', checkAccess('eliminar obras'), obraController.deleteObra)

module.exports = router
