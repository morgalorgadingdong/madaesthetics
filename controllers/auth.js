const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')
const crypto = require('node:crypto');
const { info } = require('node:console');
const fs = require("fs");
const env = require('../env');
const { Client, Environment, ApiError } =  require('square');
const axios = require("axios");
const path = require('path');
const nodemailer = require('nodemailer')
const subscriptionPath = '../subscriptions.json'
const subscriptionJSON = require(subscriptionPath)
const client = new Client({
  accessToken: env.accessTokenProduction,
  environment: Environment.Production,
});

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.email,
    pass: env.emailPW
  }
})



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
          } else if (!user.accountInitialized) {
            res.redirect('/bootcamp/initializeAccount')
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
      firstName: req.body.nameFirst,
      lastName: req.body.nameLast,
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

  exports.register = async (req, res) => {
    let subscriptions
    let newSubscriptionsJSON
    try {
      const response = await client.subscriptionsApi.searchSubscriptions({
        query: {
          filter: {}
        }
      });
      subscriptions = response.result.subscriptions
      newSubscriptionsJSON = response.result
      // console.log('From Square', subscriptions);
      compareSubscriptions()
    } catch(error) {
      console.log(error);
    }
    async function compareSubscriptions() {
      // const response = await fetch(subscriptionJSON);
      let oldSubscriptions = subscriptionJSON.subscriptions
      
      // console.log('Previous Subscriptions', oldSubscriptions)
      let newSubscriptions
      subscriptions.forEach(sub => {
        let newSub = true
        oldSubscriptions.forEach(oldSub => {
          if (sub.id == oldSub.id) {
            newSub = false
          }
        })
        if (newSub) {
          // console.log('New Subscription:', sub)
          retrieveCustomer(sub.customerId)
        }
      })
      const json = JSON.stringify(newSubscriptionsJSON, (key, value) =>
          typeof value === "bigint" ? value.toString() + "n" : value, 2);
      console.log('New subscription file:', json)
      // saveSubscriptionJSON(json)
      let subPath = path.join(__dirname, subscriptionPath);
      try {
        fs.writeFileSync(subPath, json, 'utf8', function (err) {
          if (err) throw err;
        });
      } catch (err) {
        console.log(err)
      }
      console.log('Updated JSON Subscription file') 
    }

    async function retrieveCustomer(customerId) {
      console.log('retrieving customerID')
      try {
        const response = await client.customersApi.retrieveCustomer(customerId);
        console.log('New subscription customer', response.result);
        registerAccount(response.result.customer)
      } catch(error) {
        console.log(error);
      }
    } 

    async function registerAccount(customer) {
      const validationErrors = []
      // if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
      // if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
      // if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
    
      // if (validationErrors.length) {
      //   console.log('validation error')
      //   req.flash('errors', validationErrors)
      //   return res.redirect('../signup')
      // }
      customer.email_address = validator.normalizeEmail(customer.emailAddress, { gmail_remove_dots: false })
    
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
        firstName: customer.givenName,
        lastName: customer.familyName,
        squareID: customer.id,
        email: customer.emailAddress,
        password: password,
        activeSubscription: true,
        admin: false
      })

      User.findOne({$or: [
        {email: customer.emailAddress,}
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
            console.log(err) }
          // req.logIn(user, (err) => {
          //   if (err) {
          //     console.log(err)
          //     return next(err)
          //   }
          //   res.redirect('/bootcamp/initializeAccount')
          // })
        })
      })
      //Send user email
      
      var mailOptionsCustomer = {
        from: env.email,
        to: user.email,
        subject: `Welcome to Madaesthetics Online Bootcamp!`,
        html: `<p>Hello ${user.firstName},</p>
        <p>Welcome to the Madaesthetics Online Acne Bootcamp! Please use the login information below to login for the first time.</p>
        <p>username: ${user.email}</p>
        <p>password: ${password}</p>
        <p>Once logged in, you'll see your initial questionnaire waiting for you to fill out. You'll also be able to change your password.</p>
        <p>You can expect a response to your check ins within 1 business day. If you ever need anything, feel free to email me at this address and I will get back to you as soon as I can. </p>
        <p>I'm super excited to embark on this skin care journey with you!</p>
        <p>Best,</p>
        <p>Maddie</p>`
      };
      
      transporter.sendMail(mailOptionsCustomer, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to ${user.email}: ` + info.response);
        }
      });
      
      //Send Maddie email
      var mailOptionsMaddie = {
        from: env.email,
        to: env.email,
        subject: `New Online Bootcamp Subscription - ${user.firstName}`,
        html: `<p>Name: ${user.firstName} ${user.lastName}</p>
        <p>Email: ${user.email}`
      };
      
      transporter.sendMail(mailOptionsMaddie, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to Maddie` + info.response);
        }
      });
    }

    // res.status(200).end()
    //Search subscriptions
    //Compare subscriptions to subscritions.json
    //Take the newest one, and create an account with it
    //Take web hook req, use customer ID to fetch the full customer profile and build out a signup for them
  },

  exports.createAdmin = async (req, res, next) => {
    const validationErrors = []
    let firstName = 'Morgan'
    let lastName = 'Folz'
    let email = 'morganfolz@gmail.com'
    let password = 'ding72'
    let id = '0000-0069'
    email = validator.normalizeEmail(email, { gmail_remove_dots: false })

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      // squareID: id,
      email: email,
      password: password,
      activeSubscription: true,
      squareID: id,
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

  exports.registerManual = async (req, res, next) => {
    let customer = {
      givenName: 'Izzy',
      familyName: 'Ronald',
      emailAddress: 'izzyronald13@gmail.com',
      id: '0000-0001'
    }
    
    registerAccountManual(customer)

    async function registerAccountManual(customer) {
      const validationErrors = []
      // if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
      // if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
      // if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
    
      // if (validationErrors.length) {
      //   console.log('validation error')
      //   req.flash('errors', validationErrors)
      //   return res.redirect('../signup')
      // }
      customer.email_address = validator.normalizeEmail(customer.emailAddress, { gmail_remove_dots: false })
    
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
        firstName: customer.givenName,
        lastName: customer.familyName,
        squareID: customer.id,
        email: customer.emailAddress,
        password: password,
        activeSubscription: true,
        admin: false
      })

      User.findOne({$or: [
        {email: customer.emailAddress,}
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
            console.log(err) }
          // req.logIn(user, (err) => {
          //   if (err) {
          //     console.log(err)
          //     return next(err)
          //   }
          //   res.redirect('/bootcamp/initializeAccount')
          // })
        })
      })
      //Send user email
      
      var mailOptionsCustomer = {
        from: env.email,
        to: user.email,
        subject: `Welcome to Madaesthetics Online Bootcamp!`,
        html: `<p>Hello ${user.firstName},</p>
        <p>Welcome to the Madaesthetics Online Acne Bootcamp! Please use the login information below to login for the first time.</p>
        <p>username: ${user.email}</p>
        <p>password: ${password}</p>
        <p>Once logged in, you'll see your initial questionnaire waiting for you to fill out. You'll also be able to change your password.</p>
        <p>You can expect a response to your check ins within 1 business day. If you ever need anything, feel free to email me at this address and I will get back to you as soon as I can. </p>
        <p>I'm super excited to embark on this skin care journey with you!</p>
        <p>Best,</p>
        <p>Maddie</p>`
      };
      
      transporter.sendMail(mailOptionsCustomer, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to ${user.email}: ` + info.response);
        }
      });
      
      //Send Maddie email
      var mailOptionsMaddie = {
        from: env.email,
        to: env.email,
        subject: `New Online Bootcamp Subscription - ${user.firstName}`,
        html: `<p>Name: ${user.firstName} ${user.lastName}</p>
        <p>Email: ${user.email}`
      };
      
      transporter.sendMail(mailOptionsMaddie, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to Maddie` + info.response);
        }
      });
    }
  }