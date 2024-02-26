const router = require('express').Router()
const controller = require('../models/privileges')

router.get('/privileges', controller.getAll)
router.get('/privileges/:id', controller.getSingle)
router.post('/privileges', controller.postSingle)
router.put('/privileges', controller.updateSingle)
router.delete('/privileges', controller.deleteSingle)

module.exports = router