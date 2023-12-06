const dotenv = require('dotenv')
dotenv.config({ path: "../backend/config/config.env" })

const http = require('http').createServer()
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:4000',
        methods: ['GET', 'POST']
    }
})



http.listen(process.env.SOCKET_PORT, console.log('socket OK', process.env.SOCKET_PORT))

// const io = require('socket.io')(process.env.SOCKET_PORT, {
//     cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST']
//     }
// })



let onlineUsers = []


io.on('connection', (socket) => {
    console.log('ping', socket.id)

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter((user) => {
            return user.socketId !== socket.id
        })
        io.emit('getOnlineUsers', onlineUsers)
        console.log('disc-getOnlineUsers', onlineUsers)
    })

    socket.on('addNewUser', (userId) => {

        const exist = onlineUsers.some((user) => {
            return user.userId === userId
        })


        if (!exist && userId !== null) onlineUsers.push({
            userId,
            socketId: socket.id
        })


        io.emit('getOnlineUsers', onlineUsers)
    })

    socket.on('sendMessage', (message) => {
        const user = onlineUsers.find((u) => { return u.userId === message.recipientId })
        if (user) {
            io.to(user.socketId).emit('getMessage', message)
            io.to(user.socketId).emit('getNotification', {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })



})
