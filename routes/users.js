const router = require('express').Router()
const userController = require('../models/users')

// router.route('/users')
//     .get((req, res) => {
//         res.json('get a random user')
//         console.log('get route /api/users')
//     })

router.get('/users/:id', userController.getSingle)
router.get('/users', userController.getAll)
router.post('/users', userController.postSingle)
router.put('/users', userController.updateSingle)
router.delete('/users', userController.deleteSingle)

module.exports = router