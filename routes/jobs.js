const router = require('express').Router()
const controller = require('../models/jobs')

router.get('/jobs', controller.getAll)
router.get('/jobs/bulk', controller.getMany)
router.get('/jobs/:id', controller.getSingle)
router.get('/jobs/user/:id', controller.getManyByUser)
router.post('/jobs', controller.postSingle)
router.post('/jobs/bulk/', controller.postMany)
router.put('/jobs/:id', controller.updateSingle)
router.put('/jobs/testing/:id', controller.updateTest)
router.delete('/jobs/:id', controller.deleteSingle)

module.exports = router