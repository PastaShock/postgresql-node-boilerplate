// requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')

// require routes
const routes = require('./routes')
const userRoutes = require('./routes/users')

const {networkInterfaces } = require('os');
const nets = networkInterfaces()
const port = process.env.PORT

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// set up express as the app & router
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)
app.use(userRoutes)

app.listen(port, () => {
	console.log(`server is listening on port: ${port}`);
});

module.exports = app
