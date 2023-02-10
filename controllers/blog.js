const allTheBlogs = require('../blogs.json')

module.exports = {
    getBlogsPage: (req,res)=> {
        const blogPosts = allTheBlogs
        res.render('blogs.ejs', {blogs: blogPosts})
    },
    getBlogPostPage: (req,res)=> {
        const blogPosts = allTheBlogs
        const blogNumber = Number(req.body.id)
        const blogPost = blogPosts.find((post) => post.number === blogNumber)
        res.render('blogPage.ejs', {blog: blogPost})
    }
}