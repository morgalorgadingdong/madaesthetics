const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')
// const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', blogController.getBlogsPage)
router.post('/post', blogController.getBlogPostPage)

module.exports = router