const notificationModel = require('../models/notification')




const getNotification = async (req, res) => {
    const userId = req.params.userId

    try {
        const userExist = await notificationModel.findOne({ userId })
        if (!userExist) {
            const notes = await notificationModel.create({ userId, notifications: [] })
            return res.status(200).json(notes.notifications)
        }

        const notes = await notificationModel.findOne({ userId })
        res.status(200).json(notes.notifications)
    } catch (error) {
        res.status(400).json(error)
    }
}



const createNotification = async (req, res) => {
    const userId = req.params.userId
    const arr = req.body.notifications

    try {
        const userExist = await notificationModel.findOne({ userId })
        if (!userExist) {
            const notes = await notificationModel.create({ userId, notifications: arr })
            return res.status(200).json({ message: 'OK' })
        }
        const notes = await notificationModel.findOneAndUpdate({ userId }, { notifications: arr })
        res.status(200).json({ message: 'OK' })
    } catch (error) {
        res.status(400).json(error)
    }
}




const addNotification = async (req, res) => {
    const userId = req.params.userId
    const obj = req.body.notification

    try {
        const userExist = await notificationModel.findOne({ userId })
        if (!userExist) {
            const notes = await notificationModel.create({ userId, notifications: [obj] })
            return res.status(200).json({ message: 'OK' })
        }
        console.log(userExist)
        await notificationModel.findOneAndUpdate({ userId }, { notifications: [obj, ...userExist.notifications] })
        res.status(200).json({ message: 'OK' })
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = { getNotification, createNotification, addNotification }