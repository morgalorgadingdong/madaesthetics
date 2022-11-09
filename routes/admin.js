// Get login
// Post login
// Get logout
// Put password change
// Get tasks
// Create tasks
// Update tasks

const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const bootcampController = require('../controllers/bootcamp')
const { ensureAuth } = require('../middleware/auth')


router.get('/', ensureAuth, bootcampController.getAdmin)
// router.get('/tasks', bootcamp.getTasks)
// router.put('/tasks', bootcamp.updateTask)
// router.post('/checkins', bootcampController.createCheckIns)


//User purchases subscription
// Subscription webhook fires
// Server hears request
    // Creates new user in DB
    // Creates first check in
    // 

module.exports = router