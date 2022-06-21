const router = require('express').Router()

const googleRoutes = require('./googleAuth')
const apiRoutes = require ('./apiRoutes')

router.use('/login', googleRoutes)
router.use('/api', apiRoutes)

module.exports = router