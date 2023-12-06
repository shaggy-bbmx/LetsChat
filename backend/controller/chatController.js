const chatModel = require('../models/chatModel')

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })

        
        if (chat) return res.status(200).json(chat)

        const newChat = new chatModel({
            members: [firstId, secondId]
        })

        const resp = await newChat.save()
        return res.status(200).json(resp)

    } catch (error) {
        res.status(500).json(error)
    }
}


const findUsersChats = async (req, res) => {
    const userId = req.params.userId
    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        })
        return res.status(200).json(chats)
    } catch (error) {
        res.status(500).json(error)
    }

}

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params
    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        })
        if (!chat) return res.status(400).json({ message: `Could n't find anything !!` })
        return res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }

}


module.exports = { createChat, findUsersChats, findChat }