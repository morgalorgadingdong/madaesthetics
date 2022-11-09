module.exports = {
    getIndex: (req,res)=>{
        console.log('rendering ejs')
        res.render('index.ejs')
    }
}