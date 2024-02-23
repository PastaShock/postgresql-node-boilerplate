// requires
const router = require('express').Router()
const apiRoutes = require('./api')

// set the routing for the api
router.use('/api', apiRoutes)

// default/404 page
router.use((req, res) => {
	res.status(404).send(`file not found`)
})

module.exports = router
