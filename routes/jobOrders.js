const router = require('express').Router()
const controller = require('../models/jobOrders')

router.get('/job_orders', controller.getAll)
router.get('/job_orders/bulk', controller.getMany)
router.get('/job_orders/:id', controller.getSingle)
router.get('/order_jobs/:id', controller.getJobs)
router.post('/job_orders', controller.postSingle)
router.post('/job_orders/bulk/', controller.postMany)
router.put('/job_orders/:id', controller.updateSingle)
router.put('/job_orders/testing/:id', controller.updateTest)
router.delete('/job_orders/:id', controller.deleteSingle)

module.exports = router