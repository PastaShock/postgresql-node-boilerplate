// requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path')

// require routes
const routes = require('./routes')
// import api endpoints
const userRoutes = require('./routes/users')
const privilegeRoutes = require('./routes/privileges')
const printerRoutes = require('./routes/printers')
const orderRoutes = require('./routes/orders')
const jobRoutes = require('./routes/jobs')
const jobOrderRoutes = require('./routes/jobOrders')
// const logoRoutes = require('./routes/logos')
// const userPrivRoutes = require('./routes/userPrivs')


const port = process.env.PORT

const app = express();

// set views engine to pug, this should only be a db access app so no pages should really be rendered.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// set up express as the app & router
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}))
app.use(routes)
// set routes to api end points
app.use(userRoutes)
app.use(privilegeRoutes)
app.use(printerRoutes)
app.use(orderRoutes)
app.use(jobRoutes)
app.use(jobOrderRoutes)
// app.use(logoRoutes)
// app.use(userPrivRoutes)


app.listen(port, () => {
	console.log(`server is listening on port: ${port}`);
});

module.exports = app
