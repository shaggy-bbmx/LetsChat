const router = require('express').Router()
const { getNotification, createNotification, addNotification } = require('../controller/notification')




router.get('/:userId', getNotification)
router.post('/:userId', createNotification)
router.post('/add/:userId', addNotification)


module.exports = router
