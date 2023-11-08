import users from './user.js'
import orders from './orders.js'

const mountRoutes = (app) => {
	app.use('/users', users)
	app.use('/orders', orders)
}

export default mountRoutes
