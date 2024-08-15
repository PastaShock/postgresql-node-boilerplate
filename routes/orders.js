const router = require('express').Router()
const controller = require('../models/orders')

router.get('/orders', controller.getAll)
router.get('/orders/bulk', controller.getMany)
router.get('/orders/:id', controller.getSingle)
router.get('/orders/jobs/:id', controller.getJobsByOrderId)
router.get('/orders/fundraiserid/:id', controller.getFundId)
router.get('/orders/magento/bulk', controller.getMagentoIds)
router.get('/orders/magento/:id', controller.getMagento)
router.post('/orders', controller.postSingle)
router.post('/orders/bulk/', controller.postMany)
router.put('/orders/:id', controller.updateSingle)
router.delete('/orders/:id', controller.deleteSingle)

module.exports = router