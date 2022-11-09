const mongoose = require('mongoose')

// const firstCheckInSchema = new mongoose.Schema({
//   medications: {
//     type: Array
//   },
//   medicalHistory: {
//     type: Array
//   },
//   lifestyleQ1: {
//     type: 'String'
//   }
// })
// const FirstCheckIn = mongoose.model('FirstCheckIn', firstCheckInSchema)

// const secondCheckInSchema = new mongoose.Schema({

// })
// const SecondCheckIn = mongoose.model('SecondCheckIn', secondCheckInSchema)

// const SecondCheckInAcneMedSchema = new mongoose.Schema({

// })
// const SecondCheckInAcneMed = mongoose.model('SecondCheckInAcneMed', SecondCheckInAcneMedSchema)

// const defaultCheckInSchema = new mongoose.Schema({

// })
// const defaultCheckIn = mongoose.model('defaultCheckIn', defaultCheckInSchema)

const checkInSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    required: true,
  },
  acneMed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  submitted: {
    type: Boolean,
    required: true
  },
status: {
  type: String,
  required: true
},
title: {
  type: String,
  required: true
},
  reviewed: {
    type: Boolean,
    required: true
  },
  firstCheckIn: {
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    picURL: {
      type: String,
      default: ''
    },
    medications: {
      med1: {
        med1Start: {
          type: Date,
          default: 0
        },
        med1Dur: {
          type: Number,
          default: 0
        }
      },
      med2: {
        med2Start: {
          type: Date,
          default: 0
        },
        med2Dur: {
          type: Number,
          default: 0
        }
      },
    }
  },
  reviewComments: {
    type: String,
    default: ''
  }
  // secondCheckIn: {
  //   type: mongoose.ObjectId,
  //   ref: 'SecondCheckIn',
  //   required: false
  // },
  // secondCheckInAcneMed: {
  //   type: mongoose.ObjectId,
  //   ref: 'SecondCheckInAcneMed',
  //   required: false
  // },
  // defaultCheckIn: {
  //   type: mongoose.ObjectId,
  //   ref: 'DefaultCheckIn',
  //   required: false
  // }
})

module.exports = mongoose.model('Bootcamp', checkInSchema)