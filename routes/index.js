import users from './users.js'
import orders from './orders.js'
import privileges from './privileges.js'
import user_priv from './user_priv.js'

const mountRoutes = (app) => {
	app.use('/users', users)
	app.use('/orders', orders)
}

export default mountRoutes
