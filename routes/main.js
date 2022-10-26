const express = require('express')
const router = express.Router()
const homeController = require('../controllers/main')
// const authController = require('../controllers/auth') 
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)


module.exports = router