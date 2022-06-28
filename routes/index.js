const router = require('express').Router()

const googleRoutes = require('./googleAuth')
const apiRoutes = require ('./apiRoutes')
const authRoutes = require('./authRoutes')
const requireJwtAuth = require('../middleware/requireJwtAuth');

router.use('/login', googleRoutes)
router.use('/auth', authRoutes)
router.use('/api', requireJwtAuth, apiRoutes)

module.exports = router