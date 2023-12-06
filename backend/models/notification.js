const mongoose = require('mongoose')


const notificationSchema = new mongoose.Schema(
    {
        userId: String,
        notifications: Array
    },
    {
        timestamps: true
    }
)

const notificationModel = mongoose.model('notificationModel', notificationSchema)
module.exports = notificationModel
