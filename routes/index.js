// requires
const router = require('express').Router()

router.get('/', (req, res, next) => {
    res.render('index', {title: 'Snap Warehouse'})
    console.log('got route /')
})

router.get('/info', (req, res) => {
    res.render('info', {title: 'information'})
    console.log('get route /info')
})

module.exports = router