// Update store items (post)

// Create checkout page (post)

const express = require('express')
const router = express.Router()
const storeController = require('../controllers/store') 
// const { ensureAuth } = require('../middleware/auth')

router.post('/hook', storeController.updateStore)

router.post('/checkout', storeController.checkout)

module.exports = router