const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config({ path: "../config/config.env" })
const { registerUser, loginUser, findUser, getUsers } = require('../controller/userController')
const isAuth = require('../middleware/isAuth')
const Multer = require('multer')
const { Storage } = require('@google-cloud/storage')
const { v4: uuidv4 } = require('uuid')
const userModel = require('../models/userModels')
const { uploadFile, info } = require('@uploadcare/upload-client')





const multer = Multer({
    storage: Multer.memoryStorage()
})

let projectId = 'savvy-palace-384713'
let keyFilename = 'mykey.json'

const storage = new Storage({
    projectId,
    keyFilename
})

const bucket = storage.bucket('prac_prj_bucket_1')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/find/:id', isAuth, findUser)
router.get('/', isAuth, getUsers)

router.post('/uploadPic', multer.single('image'), async (req, res) => {
    try {
        // All This code is for uploading to Google Cloud Console which is no longer free-----------
        // let name = uuidv4() + '.jpg'
        // const resp = await bucket.file(name).save(req.file.buffer)

        // const [files] = await bucket.getFiles()
        // const targetFile = files.find((file) => file.name === name)
        // const url = `https://storage.googleapis.com/${targetFile.bucket.name}/${targetFile.id}`
        // ------------------------------------------------------------------------------------------

        const result = await uploadFile(req.file.buffer, {
            publicKey: process.env.UPLOAD_CARE,
            store: 'auto',
            metadata: {
                subsystem: 'js-client',
                pet: 'cat'
            }
        })
        
        const url = 'https://ucarecdn.com/' + `${result.uuid}` + '/original'
        console.log(url)
        const user = await userModel.findOneAndUpdate({ email: req.body.email }, { url }, { new: true })
        res.status(200).json({ success: true })

    } catch (error) {
        res.status(400).json(error)
    }
})



module.exports = router
