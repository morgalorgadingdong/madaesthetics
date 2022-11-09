const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const crypto = require('node:crypto');
const { info } = require('node:console');

 exports.getLogin = (req, res) => {
  console.log('get login from auth controller')  
  if (req.user) {
      return res.redirect('../bootcamp')
    }
    // res.redirect('/login.html')
    res.render('login.ejs')
  }
  
  exports.postLogin = (req, res, next) => {
    console.log(req.body.email, req.body.password)
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    // if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
    if (validationErrors.length) {
      console.log('validation error')
      req.flash('errors', validationErrors)
      return res.redirect('/login')
    }
    console.log('0')
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
    console.log('1')
    passport.authenticate('local', (err, user, info) => {
      if (err) { 
        console.log('2')
        return next(err) }
      if (!user) {
        console.log(info)
        req.flash('errors', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        console.log('4')
        if (err) { return next(err) }
          req.flash('success', { msg: 'Success! You are logged in.' })
          if (user.admin) {
            res.redirect(req.session.returnTo || '/admin')
          } else {
            res.redirect(req.session.returnTo || '/bootcamp')
          }
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/bootcamp')
    }
    res.sendFile('bootcampsignup.html')
  }
  
  exports.postSignup = async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    // if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    // if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      console.log('validation error')
      req.flash('errors', validationErrors)
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    let password = await getIdempotencyKey()

    async function getIdempotencyKey() {
      return await generateIdempotencyKey('test')
    }
    function generateIdempotencyKey(cryptoKey) {
    let key
    return new Promise(resolve => {
      let salt = crypto.randomBytes(8).toString("hex")
      crypto.scrypt(cryptoKey, salt, 32, (err, derivedKey) => {
      if (err) throw err;
      key = derivedKey.toString("base64");
      console.log('key', key)
      resolve(key)
      })
    })
    }

    console.log(password)

    const user = new User({
      firstName: req.body.name,
      squareID: req.body.id,
      email: req.body.email,
      password: password,
      activeSubscription: true,
      admin: false
    })

    User.findOne({$or: [
      {email: req.body.email}
      // {userName: req.body.userName}
    ]}, (err, existingUser) => {
      if (err) { 
        return next(err) }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address or username already exists.' })
        return res.redirect('../login')
      }
      user.save((err) => {
        if (err) { 
          return next(err) }
        req.logIn(user, (err) => {
          if (err) {
            console.log(err)
            return next(err)
          }
          res.redirect('/bootcamp/initializeAccount')
        })
      })
    })
  }

  exports.getChangePassword = async (req, res) => {
    console.log('get login from auth controller')  
    if (req.user) {
      return res.render('changePassword.ejs')
    }
    // res.redirect('/login.html')
    res.redirect('/')
  }

  exports.changePassword = async (req, res) => {
    const validationErrors = []
    const infoMessages = []
    // if (req.body.oldPassword !== req.user.password) validationErrors.push({ msg: 'Old password ' })
    if (validator.isEmpty(req.body.newPassword)) validationErrors.push({ msg: 'Password cannot be blank.' })
    if (req.body.newPassword !== req.body.confirmNewPassword) validationErrors.push({ msg: 'Passwords do not match' })
    
    if (validationErrors.length) {
      console.log('validation error')
      req.flash('errors', validationErrors)
      return res.redirect('/changePassword')
    } else {
      const users = await User.find({_id:req.user._id})
      const user = users[0]
      console.log(user)
      user.password = req.body.newPassword
      console.log(user)
      await user.save((err) => {
        if (err) { 
          console.log('error')
            console.log(err) }
      })
      infoMessages.push({ msg: 'Password successfully changed' })
      req.flash('info', infoMessages)
      res.redirect('/bootcamp')
    }
    
  }

  exports.createAdmin = async (req, res, next) => {
    const validationErrors = []
    let name = 'admin'
    let email = 'admin@admin.com'
    let password = 'admin1234'
    let id = '0000-0000'
    email = validator.normalizeEmail(email, { gmail_remove_dots: false })

    const user = new User({
      firstName: name,
      squareID: id,
      email: email,
      password: password,
      activeSubscription: true,
      admin: true
    })

    User.findOne({$or: [
      {email: req.body.email}
      // {userName: req.body.userName}
    ]}, (err, existingUser) => {
      if (err) { 
        return next(err) }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address or username already exists.' })
        return res.redirect('../login')
      }
      user.save((err) => {
        if (err) { 
          return next(err) }
        req.logIn(user, (err) => {
          if (err) {
            console.log(err)
            return next(err)
          }
          res.redirect('/bootcamp')
        })
      })
    })
  }