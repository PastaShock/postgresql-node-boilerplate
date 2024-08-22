const router = require('express').Router()
const controller = require('../models/metrics')

router.get('/ordersbyprinter', controller.getOrdersByPrinter)
// router.get('metrics/ordersbyprinter/:id', controller.getOneOrderByPrinter)// count of orders or units/order
router.get('/unitsbyprinter', controller.getUnitsByPrinter)
// router.get('metrics/ordersbyuser', controller.getOrdersByUser)          // count of orders or units/order
// router.get('metrics/ordersbyuser/:id', controller.getOneOrderByUser)   // printer_id

module.exports = router