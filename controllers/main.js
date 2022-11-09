module.exports = {
    getIndex: (req,res)=> {
        console.log('getting index page')
        res.sendFile('index.html');
    }
}