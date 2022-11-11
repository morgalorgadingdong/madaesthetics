const Bootcamp = require('../models/Bootcamp')
const User = require('../models/User')
const fs = require("fs");
// const axios = require("axios");
// const client = new Client({
//   accessToken: env.accessToken,
//   environment: Environment.Production,
// });

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
// const path = require('path');

module.exports = {
  register: async (req, res) => {
    console.log(req)
    try {
      const response = await client.subscriptionsApi.searchSubscriptions({
        query: {
          filter: {}
        }
      });
    
      console.log(response.result);
    } catch(error) {
      console.log(error);
    }
    //Search subscriptions
    //Compare subscriptions to subscritions.json
    //Take the newest one, and create an account with it
    //Take web hook req, use customer ID to fetch the full customer profile and build out a signup for them
  }, 
  getHomePage: async (req, res) => {
        if (req.user) {
            return res.redirect('../bootcamp')
          }
        //   res.redirect('/bootcamp/about')
        res.redirect('/bootcamp.html');
        },
    getDashboard: async (req, res) => {
        // res.render('dashboard.ejs', {checkIns: checkInItems, user: req.user})
        if (req.user.admin) {
            res.redirect('/admin')
        } else {
            const checkInItems = await Bootcamp.find({userId:req.user.id})
            let clientCheckIns = []
            let maddieCheckIns = []
            checkInItems.forEach(el => {
                if (el.submitted == false) {
                    clientCheckIns.push(el)
                } else {
                    maddieCheckIns.push(el)
                }
            })
            clientCheckIns.forEach(el => {console.log(el.dueDate)})
            clientCheckIns.sort((a, b) => a.dueDate - b.dueDate)
            
            // maddieCheckIns.sort((a, b) => {
            //     a.dueDate - b.dueDate
            // })
            res.render('dashboard.ejs', {checkIns: checkInItems,  user: req.user, clientCheckIns: clientCheckIns, maddieCheckIns: maddieCheckIns})
        }
    },
    getAboutPage: (req, res) => {
        console.log('sending bootcamp about page')
        // res.sendFile('../public/bootcamp.html', {root: __dirname});
        res.redirect('/bootcamp.html')
    },
    getAdmin: async (req, res) => {
        if (!req.user.admin) {
            return res.redirect('../bootcamp')
        } else {
        const checkInItems = await Bootcamp.find({})
        
        let unreviewedCheckIns = []
        let reviewedCheckIns = []
        checkInItems.forEach(el => {
            if (el.submitted == true) {
                if (el.reviewed == false) {
                    unreviewedCheckIns.push(el)
                } else {
                    reviewedCheckIns.push(el)
                }
            }
        })
            const users = await User.find({})
            let userCount = users.length - 1
            let unreviewedCheckInCount = unreviewedCheckIns.length
            console.log(unreviewedCheckIns)
            res.render('admin.ejs', {unreviewedCheckIns: unreviewedCheckIns, reviewedCheckIns: reviewedCheckIns, userCount: userCount, checkInCount: unreviewedCheckInCount})
        }
    },
    initializeAccount: async (req, res) => {
        //
        // Create first checkin
        //
        
        let date = new Date()
        // let today = new Date()
        let userName = `${req.user.firstName} ${req.user.lastName}`
        // date.setDate(date.getDate() + 28)
        // let diff = (date - today) / 1000 / 60 / 60 / 24
        let checkIn = new Bootcamp({
            // userId: '6363f254b20c6ec9b981bcaf',
            userId: req.user._id,
            userEmail: req.user.email,
            checkIn: 'first',
            acneMed: false,
            dueDate: date,
            submitted: false,
            active: false,
            reviewed: false,
            status: 'Incomplete',
            title: 'Initial Questionnaire',
            userName: userName
          })
        await checkIn.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
        })

        const users = await User.find({_id:req.user._id})
        const user = users[0]
        user.initializeAccount = true
        await user.save((err) => {
          if (err) { 
            console.log('error')
              console.log(err) }
        })
        //Email user with login information and reminder to complete first check in

        res.redirect('/bootcamp')
    },
    getFirstCheckIn: async (req, res) => {
        console.log(req.user)
        console.log(req.body)
        const checkIn = await Bootcamp.find({_id: req.body.id})
        console.log(checkIn)
        if (!req.user) {
            return res.redirect('../bootcamp')
        } else {
            res.render('firstCheckIn.ejs', {user: req.user, checkIn: checkIn[0]})
        }
    },
    getSecondCheckIn: async (req, res) => {
      console.log(req.user)
      console.log(req.body)
      const checkIn = await Bootcamp.find({_id: req.body.id})
      console.log(checkIn)
      if (!req.user) {
          return res.redirect('../bootcamp')
      } else {
          res.render('secondCheckIn.ejs', {user: req.user, checkIn: checkIn[0]})  
      }
  },
    postFirstCheckIn: async (req, res) => {
        const checkIns = await Bootcamp.find({userId:req.user.id, checkIn: req.body.checkInNumber})
        const checkIn = checkIns[0]
        const users = await User.find({_id:req.user._id})
        const user = users[0]
        // console.log(req)
        // console.log(req.body)
        // console.log(req.files)
        // console.log(checkIns)

        //Update user profile with info
        user.age = req.body.age
        // user.skinType = req.body.lifestyleQ2

        // Update Check In document with form data
        checkIn.firstCheckIn.name = req.body.name
        checkIn.firstCheckIn.email = req.body.email
        //Medications
        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration
        // checkIn.firstCheckIn.medications.androstendione.start = req.body.androstendioneStart
        // checkIn.firstCheckIn.medications.androstendione.duration = req.body.androstendioneDuration
        // checkIn.firstCheckIn.medications.antibiotics.start = req.body.antibioticsStart
        // checkIn.firstCheckIn.medications.antibiotics.duration = req.body.antibioticsDuration
        // checkIn.firstCheckIn.medications.avita.start = req.body.avitaStart
        // checkIn.firstCheckIn.medications.avita.duration = req.body.avitaDuration
        // checkIn.firstCheckIn.medications.azelex.start = req.body.azelexStart
        // checkIn.firstCheckIn.medications.azelex.duration = req.body.azelexDuration

        // checkIn.firstCheckIn.medications.benzoylstart = req.body.benzoylStart
        // checkIn.firstCheckIn.medications.benzoylduration = req.body.benzoylDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration

        // checkIn.firstCheckIn.medications.accutane.start = req.body.accutaneStart
        // checkIn.firstCheckIn.medications.accutane.duration = req.body.accutaneDuration


        checkIn.firstCheckIn = req.body
        checkIn.submitted = true
        checkIn.status = 'Awaiting feedback'
        // checkIn.active = false

        let i = 1
        for (const picture of req.files) {
          try {
            const result = await cloudinary.uploader.upload(picture.path)
            if (i == 1) {
              checkIn.pic1URL = result.url
            } else if (i == 2) {
              checkIn.pic2URL = result.url
            } else if (i == 3) {
              checkIn.pic3URL = result.url
            }
            i++
          } catch(error) {
            console.log(error);
          }
        }
        console.log(req.body)
        console.log(checkIn)
        checkIn.save((err) => {
            if (err) { 
              console.log('error')
              console.log(err) }
            else {
              console.log('updated Database')
            }
          })

        
        



        //OLD image upload code
        // await cloudinary.uploader.upload(req.files[0].path)
	      //   .then(result => {
        //         checkIn.pic1URL = result.url
        //         checkIn.save((err) => {
        //             if (err) { 
        //             console.log('error')
        //                 console.log(err) }
        //                 else {
        //                     console.log('updated Database')
        //                 }
        //             })
        //     })
	      //   .catch(error => {console.log(error)});
        
        //Email Maddie letting her know there's a new Check In to review, set email reminder to true
        res.redirect('/bootcamp')
    },  
    postFirstCheckInReview: async (req, res) => {
        const checkInItem = await Bootcamp.find({_id: req.body.id})
        // console.log(req)
        console.log(req.body)
        console.log(checkInItem)
        checkInItem[0].reviewComments = req.body.comments
        checkInItem[0].status = 'Complete'
        checkInItem[0].active = true
        checkInItem[0].reviewed = true
        if (req.body.acneMed) {
            checkInItem[0].acneMed = true
        }
        checkInItem[0].save((err) => {
            if (err) { 
                console.log('error')
                console.log(err) }
            else {
                console.log('updated Database')
            }
            })
        
        //Initialize rest of check ins
        let date = new Date()
        let date2 = new Date()
        let date3 = new Date()
        let date4 = new Date()
        let date5 = new Date()
        let date6 = new Date()
        let date7 = new Date()

        date2.setDate(date.getDate() + 14)
        date3.setDate(date.getDate() + 28)
        date4.setDate(date.getDate() + 42)
        date5.setDate(date.getDate() + 56)
        date6.setDate(date.getDate() + 70)
        date7.setDate(date.getDate() + 84)

        let checkIn2 = new Bootcamp({
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'second',
            acneMed: checkInItem[0].acneMed,
            dueDate: date2,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 2 Check In'
          })
          checkIn2.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          let checkIn3 = new Bootcamp({
            // userId: '63645fc5afc0880f6c6a89a9',
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'third',
            acneMed: checkInItem[0].acneMed,
            dueDate: date3,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 4 Check In'
            // title: 'Initial Questionnaire'
          })
          checkIn3.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          let checkIn4 = new Bootcamp({
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'fourth',
            acneMed: checkInItem[0].acneMed,
            dueDate: date4,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 6 Check In'
          })
          checkIn4.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          let checkIn5 = new Bootcamp({
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'fifth',
            acneMed: checkInItem[0].acneMed,
            dueDate: date5,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 8 Check In'
          })
          checkIn5.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          let checkIn6 = new Bootcamp({
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'sixth',
            acneMed: checkInItem[0].acneMed,
            dueDate: date6,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 10 Check In'
          })
          checkIn6.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          let checkIn7 = new Bootcamp({
            userId: checkInItem[0].userId,
            userName: checkInItem[0].userName,
            userEmail: checkInItem[0].userEmail,
            checkIn: 'seventh',
            acneMed: checkInItem[0].acneMed,
            dueDate: date7,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            title: 'Week 12 Check In'
          })
          checkIn7.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })

        res.redirect('/bootcamp')
    },
    // createOneCheckIn: async (req, res) => {
    //     let date = new Date()
    //     let today = new Date()
        
    //     // date.setDate(date.getDate() + 28)
    //     // let diff = (date - today) / 1000 / 60 / 60 / 24
    //     //Checkin 2
    //     let checkIn = new Bootcamp({
    //         // userId: '63645fc5afc0880f6c6a89a9',
    //         userId: '6366b797532100be8f7ec378', //bob
    //         // userId: req.userID,
    //         checkIn: 'first',
    //         acneMed: false,
    //         dueDate: date,
    //         submitted: false,
    //         active: true,
    //         reviewed: false,
    //         status: 'Incomplete',
    //         // title: 'Week 2 Check In'
    //         title: 'Initial Questionnaire'
    //       })
    //       await checkIn.save((err) => {
    //         if (err) { 
    //           console.log('error')
    //             console.log(err) }
    //         })
    //       res.redirect('/bootcamp')
    // },
    createSecondCheckIn: async (req, res) => {
        console.log(req.user)
        let date = new Date()
        let today = new Date()
        
        date.setDate(date.getDate() + 14)
        let diff = (date - today) / 1000 / 60 / 60 / 24
        let checkIn = new Bootcamp({
            // userId: '63645fc5afc0880f6c6a89a9',
            // userId: '6366b797532100be8f7ec378', //bob
            userId: req.user._id,
            userEmail: req.user.email,
            checkIn: 'second',
            acneMed: false,
            dueDate: date,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            // title: 'Week 2 Check In'
            title: 'Week 2 Check In'
          })
          await checkIn.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          res.redirect('/bootcamp')
    }
    // initializeFirstCheckIn: (req, res) => {
        //Take user ID from Square webhook, create first checkin with it
        
        // 
    // }
}







//Cancel subscription code
// Get User Subscription
// try {
//     const response = await client.subscriptionsApi.searchSubscriptions({
//       query: {
//         filter: {
//           customerIds: [
//             'ZZ7B1650DQD6P854RC5AXCJ150'
//           ]
//         }
//       }
//     });
  
//     console.log(response.result);
//   } catch(error) {
//     console.log(error);
//   }
// Returns subscriptions.id


// Cancel subscription
//  try {
//     const response = await client.subscriptionsApi.cancelSubscription(subscription.id);
//     console.log(response.result);
//   } catch(error) {
//     console.log(error);
//   }