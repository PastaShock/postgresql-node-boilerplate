// requires
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')

// require API routes
// const routes = require('./routes')
const {networkInterfaces } = require('os');
const nets = networkInterfaces()
const addressLo = nets.lo[0].address
const port = process.env.PORT

const userController = require('./routes/api/users')
const app = express();

// set up express as the app & router
app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({extended: true}))
// app.use(routes)

app.get('/api', (req, res) => {
	res.json({ info: 'NEPP stack'})
})
app.get('/', (req, res) => {
	res.json({ info: 'work in progress' })
})
app.get('/api/users/', userController.getAll)
app.get('/api/users/:id', userController.getSingle)
app.post('/api/users/', userController.postSingle)
app.put('/api/users/', userController.updateSingle)
app.delete('/api/users/', userController.deleteSingle)

app.listen(port, () => {
	console.log(`server is listening on port: ${port}`);
});
