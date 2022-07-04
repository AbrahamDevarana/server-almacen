const router = require('express').Router()
const userRoute = require('./apiRoutes/userRoute')

router.use('/user', userRoute)


module.exports = router