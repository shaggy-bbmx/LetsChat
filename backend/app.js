const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })
const express = require('express')
const app = express()
const http = require('http')          ///NEED TO CREATE A SERVER INSTANCE FOR SOCKET.IO
const server = http.createServer(app) ///
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoutes.js')
const chatRoute = require('./routes/chatRoute.js')
const messageRoute = require('./routes/messageRoute.js')
const notificationRoute = require('./routes/notificationRoute.js')
const cookieParser = require('cookie-parser')
const path = require('path')






mongoose.connect('mongodb+srv://sagarpatel:sagarpatel@task-manager.lw16tyr.mongodb.net/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB  is OK'))
    .catch(error => console.log(error.message))

server.listen(process.env.PORT, console.log(`SERVER RUNING OK`))
app.use(cors())
app.use(express.json())
app.use(cookieParser())




app.use('/api/users', userRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
app.use('/api/notification', notificationRoute)


app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
})


/*--------------------SOCKET CODE BEGINS FROM HERE-----------------------*/


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
