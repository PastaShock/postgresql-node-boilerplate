require('dotenv').config();

const initOptions = {
	capSQL: true
}

const pgp = require('pg-promise')(initOptions)

const conString = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
}

const db = pgp(conString)

db.one('SELECT $1 AS value', '2800e06c-6617-4534-b9bd-56497576aa7b')
	.then((data) => {
		console.log('DATA:', data.value)
	})
	.catch((error) => {
		console.log('ERROR:', error)
	})

// const port = process.env.PORT
// const express = require('express');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');

// const app = new express();

// // routes
// // const userRoute = require('./routes/users.js');
// const dataRoutes = require('./routes/index.js');
// const authRoute = require('./routes/auth.js');

// // middlewares
// const authMiddleware = require('./middlewares/auth.middleware');

// //api
// const apiUserRoute = require('./api/routes/user.js');

// app.use('/static', express.static('public'));
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser(process.env.SESSION_SECRET));

// app.set('view engine', 'pug');
// app.set('views', './views');

// app.get('/', (req, res) => {
// 	res.render('index', {
// 		name: 'name'
// 	});
// });

// //use routes
// app.use('/users', authMiddleware, checkToken, authMiddleware.protectedRoute, dataRoutes);
// app.use('/auth', authRoute);

// //use API
// app.use('/api/users', apiUserRoute);

// app.listen(port, () => {
// 	console.log('Server is running on port: ' + port);
// });
