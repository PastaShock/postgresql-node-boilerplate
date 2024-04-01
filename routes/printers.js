const router = require('express').Router()
const controller = require('../models/printers')

router.get('/printers', controller.getAll)
router.get('/printers/:id', controller.getSingle)
router.get('/printersByName/:id', controller.getSingleByName)
router.post('/printers', controller.postSingle)
router.put('/printers', controller.updateSingle)
router.delete('/printers', controller.deleteSingle)

module.exports = router