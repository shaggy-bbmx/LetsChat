const dotenv = require('dotenv')
dotenv.config({ path: "./config/config.env" })
const express = require('express')
const app = express()
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

app.listen(process.env.PORT, console.log(`SERVER RUNING OK`))
// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
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