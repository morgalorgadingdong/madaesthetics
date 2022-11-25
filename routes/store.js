// Update store items (post)

// Create checkout page (post)

const express = require('express')
const router = express.Router()
const storeController = require('../controllers/store') 
// const { ensureAuth } = require('../middleware/auth')



//TESTING WEBHOOK FUNCTIONALITY
// console.log('test')
// storeController.updateStore('test')

router.post('/hook', storeController.updateStore)
// router.get('/hook', storeController.updateStore)

// router.post('/checkout', storeController.checkout)
router.post('/checkout', storeController.checkoutSale)

module.exports = router