const router = require('express').Router()
const controller = require('../models/users')

router.get('/users/:id', controller.getSingle)
router.get('/usersByName/:name', controller.getByName)
router.get('/users', controller.getAll)
router.post('/users', controller.postSingle)
router.put('/users', controller.updateSingle)
router.delete('/users', controller.deleteSingle)

module.exports = router