const { createMessage, getMessage,deleteMessage } = require('../controller/messageController')
const isAuth = require('../middleware/isAuth')


const router = require('express').Router()

router.post('/', isAuth, createMessage)
router.get('/:chatId', isAuth, getMessage)
router.delete('/delete/:id',deleteMessage)



module.exports = router
