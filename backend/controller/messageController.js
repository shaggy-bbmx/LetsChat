const messageModel = require('../models/messageModel')


const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body

    const message = new messageModel({
        chatId, senderId, text
    })

    try {
        const resp = await message.save()
        res.status(200).json(resp)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getMessage = async (req, res) => {
    const { chatId } = req.params

    try {
        const messages = await messageModel.find({ chatId })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteMessage = async (req, res) => {
    const { id } = req.params
    try {
        const messages = await messageModel.findByIdAndDelete(id)
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { createMessage, getMessage, deleteMessage }