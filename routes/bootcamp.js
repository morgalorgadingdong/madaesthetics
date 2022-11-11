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
const { updateCheckIns, combinePhotos } = require('../middleware/bootcamp')
const upload = require("../middleware/multer");


router.get('/', updateCheckIns, ensureAuth, bootcampController.getDashboard)
router.get('/about', bootcampController.getAboutPage)
router.get('/login', updateCheckIns, authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)
// router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/admin', updateCheckIns, bootcampController.getAdmin)
router.get('/initializeAccount', bootcampController.initializeAccount)


//Check Ins
router.post('/firstCheckIn', ensureAuth, bootcampController.getFirstCheckIn)
router.post('/firstCheckInSubmit', upload.array('photos', 3), bootcampController.postFirstCheckIn)
router.post('/firstCheckInReview', ensureAuth, bootcampController.postFirstCheckInReview)

router.post('/secondCheckIn', ensureAuth, bootcampController.getSecondCheckIn)
// router.post('/firstCheckIn', upload.single("file"), bootcampController.postFirstCheckIn)
// router.get('/secondCheckIn', ensureAuth, bootcampController.getSecondCheckIn)
// router.post('/secondCheckIn', upload.single("file"), bootcampController.postSecondCheckIn)
// router.get('/firstCheckIn', ensureAuth, bootcampController.getFirstCheckIn)
// router.post('/firstCheckIn', upload.single("file"), bootcampController.postFirstCheckIn)


// DEV SPECIFIC ROUTES
// router.get('/createFirst', bootcampController.createOneCheckIn)
router.get('/createSecond', bootcampController.createSecondCheckIn)
router.get('/createAdmin', authController.createAdmin)
router.get('/test2', updateCheckIns, bootcampController.getAboutPage)
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