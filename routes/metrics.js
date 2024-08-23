const router = require('express').Router()
const controller = require('../models/metrics')

router.get('/m/orders/printers', controller.getOrdersByPrinter)
// router.get('metrics/ordersbyprinter/:id', controller.getOneOrderByPrinter)// count of orders or units/order
router.get('/m/units/printers', controller.getUnitsByPrinter)
// router.get('metrics/ordersbyuser', controller.getOrdersByUser)          // count of orders or units/order
// router.get('metrics/ordersbyuser/:id', controller.getOneOrderByUser)   // printer_id
router.get('/m/orders/users', controller.getOrdersByUsers)
router.get('/m/orders/users/:id', controller.getOrdersByUserID)
router.get('/m/units/:id/:date', controller.getUnitsByUserByDay)
router.get('/m/jobs/:date', controller.getJobsByDay)
router.get('/m/orders/:date', controller.getOrdersByDay)

module.exports = router