// requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')

// require routes
const apiRoutes = require('./routes/api')
const routes = require('./routes')

// const routes = require('./routes')
const {networkInterfaces } = require('os');
const nets = networkInterfaces()
const port = process.env.PORT

const app = express();

// set up express as the app & router
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)
app.use(apiRoutes)

app.listen(port, () => {
	console.log(`server is listening on port: ${port}`);
});
