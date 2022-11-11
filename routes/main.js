const express = require('express')
const router = express.Router()
const homeController = require('../controllers/main')
const authController = require('../controllers/auth') 
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
// router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/changePassword', authController.getChangePassword)
router.post('/changePassword', authController.changePassword)
router.get('/createAdmin', authController.createAdmin)

module.exports = router