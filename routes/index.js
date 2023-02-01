const router = require('express').Router()

const googleRoutes = require('./googleAuth')
const apiRoutes = require ('./apiRoutes')
const authRoutes = require('./authRoutes')
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.use('/google-login', googleRoutes)
router.use('/auth', authRoutes)
router.use('/', requireJwtAuth, apiRoutes)

module.exports = router