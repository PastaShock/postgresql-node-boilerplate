requite('dotenv').config();

const port = process.env.PORT
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = new express();

// routes
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

// middlewares
const authMiddleware = require('./middlewares/auth.middleware');

//api
const apiUserRoute = require('./api/routes/user.route');

app.use('/static', express.static('public'));
app.use(express.json())
app.use(express.uerlencoded({ extended: true }))
app.use(cookieParser(process.env.SESSION_SECRET));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
	res.render('index', {
		name: 'name'
	});
});

//use routes
app.use('/users', authMiddleware,.checkToken, authMiddleware.protectedRoute, userRoute);
app.use('/auth', authRoute);

//use API
app.use('/api/users', apiUserRoute);

app.listen(port, () => {
	console.log('Server is running on port: ' + port);
});
