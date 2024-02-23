// requires
const router = require('express').Router()

// import api endpoints
const userRoutes = require('./users')
// const privilegeRoutes = require('./privileges')
// const printerRoutes = require('./printers')
// const logoRoutes = require('./logos')
// const userPrivRoutes = require('./userPrivs')

// set routes to prev est end points
router.use('/users', userRoutes)
// router.use('/privileges', privilegeRoutes)
// router.use('/printers', printerRoutes)
// router.use('/logos', logoRoutes)
// router.use('/userPrivs', userPrivRoutes)

module.exports = router