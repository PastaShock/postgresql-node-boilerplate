const router = require('express').Router()
const controller = require('../models/orders')

router.get('/orders', controller.getAll)
router.get('/orders/:id', controller.getSingle)
router.post('/orders', controller.postSingle)
router.put('/orders', controller.updateSingle)
router.delete('/orders/:id', controller.deleteSingle)

module.exports = router