const Bootcamp = require('../models/Bootcamp')
const User = require('../models/User')
// const fs = require("fs");
// const axios = require("axios");

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
// const path = require('path');

module.exports = {
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
        if (req.user.admin) {
            res.render('firstCheckIn.ejs', {user: req.user, checkIn: checkIn[0]})
        } else {
            res.render('firstCheckIn.ejs', {user: req.user, checkIn: checkIn[0]})
        }
            
        }
    },
    postFirstCheckIn: async (req, res) => {
        const checkInItem = await Bootcamp.find({userId:req.user.id, checkIn: req.body.checkInNumber})
        // console.log(req)
        console.log(req.body)
        console.log(checkInItem)
        checkInItem[0].firstCheckIn.name = req.body.name
        checkInItem[0].firstCheckIn.email = req.body.email
        checkInItem[0].submitted = true
        checkInItem[0].status = 'Awaiting feedback'
        checkInItem[0].active = false
        await cloudinary.uploader.upload(req.file.path)
	        .then(result => {
                checkInItem[0].firstCheckIn.picURL = result.url
                console.log(result)
                checkInItem[0].save((err) => {
                    if (err) { 
                    console.log('error')
                        console.log(err) }
                        else {
                            console.log('updated Database')
                        }
                    })
            })
	        .catch(error => {console.log(error)});
        
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
    createOneCheckIn: async (req, res) => {
        let date = new Date()
        let today = new Date()
        
        // date.setDate(date.getDate() + 28)
        // let diff = (date - today) / 1000 / 60 / 60 / 24
        //Checkin 2
        let checkIn = new Bootcamp({
            // userId: '63645fc5afc0880f6c6a89a9',
            userId: '6366b797532100be8f7ec378', //bob
            // userId: req.userID,
            checkIn: 'first',
            acneMed: false,
            dueDate: date,
            submitted: false,
            active: true,
            reviewed: false,
            status: 'Incomplete',
            // title: 'Week 2 Check In'
            title: 'Initial Questionnaire'
          })
          await checkIn.save((err) => {
            if (err) { 
              console.log('error')
                console.log(err) }
            })
          res.redirect('/bootcamp')
    },
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