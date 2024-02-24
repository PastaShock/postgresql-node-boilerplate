// requires
const router = require('express').Router()
const apiRoutes = require('./api')
const userRoutes = require('./users')

// set the routing for the api
router.use('/api', apiRoutes)
router.use('/users', userRoutes)

router.get('/', (req, res) => {
	res.json({ info: 'work in progress' })
})

// default/404 page
// router.use((req, res) => {
// 	res.status(404).send(`file not found`)
// })

module.exports = router
