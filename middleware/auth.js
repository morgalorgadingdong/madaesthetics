module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/bootcamp/about')
    }
  }
}

    // isAuth: function (req, res, next) {
    //   if (req.isAuthenticated()) {
    //     return true
    //   } else {
    //     return false
    //   }
    // }