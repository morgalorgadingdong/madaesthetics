
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
// const { boolean } = require('square/dist/schema')
// const { boolean } = require('square/dist/schema')

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String 
  },
  lastName: {
    type: String 
  },
  age: {
    type: Number
  },
  squareID: {
    type: String 
    // unique: true
  },
  activeSubscription: {
    type: Boolean,
    required: true
  },
  email: { 
    type: String, 
    unique: true },
  password: String,
  admin: {
    type: Boolean,
    required: true
  },
  userName: {
    type: String,
    unique: false,
    required: false
  },
  accountInitialized: {
    type: Boolean,
    default: false
  }
})


// Password hash middleware.
 UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})


// Helper method for validating user's password.
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}


module.exports = mongoose.model('User', UserSchema)