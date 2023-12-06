const { createChat, findUsersChats, findChat } = require('../controller/chatController')
const isAuth = require('../middleware/isAuth')

const router = require('express').Router()


router.post('/', isAuth, createChat)
router.get('/:userId', isAuth, findUsersChats)
router.get('/find/:firstId/:secondId', isAuth, findChat)


module.exports = router
