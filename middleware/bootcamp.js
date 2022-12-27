const checkIn = require('../models/Bootcamp')
const env = require('../env');
const nodemailer = require('nodemailer')


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.email,
    pass: env.emailPW
  }
})

module.exports = {
    updateCheckIns: async function (req, res, next) {
      let today = new Date()
      const checkIns = await checkIn.find({})
      for (const el of checkIns) {
        let delta = (el.dueDate - today)/ 1000 / 60 / 60 / 24
        if (delta <= 1) {
          if (!el.submitted && !el.reviewed) {
            el.set({status: 'Incomplete'})
            el.set({active: true})
            if (!el.submitted) {
              let title = el.title
              if (!el.firstEmailReminder) {
                // Send user email letting them know that they can now complete their next check in
                var mailOptions = {
                  from: env.email,
                  to: el.userEmail,
                  subject: `It's time to complete your ${title}!`,
                  html: `<p>${el.userName} - it's time to complete your bi-weekly acne check in over at </p><br><a href='https://madaesthetics.co/bootcamp'>madaesthetics.co</a>!
                  <p>As always, feel free to shoot me an email if you have any questions/comments/concerns!</p>
                  <p>Best,</p>
                  <p>Maddie</p>
                  <p>madaestheticsllc@gmail.com`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(info.response);
                  }
                });
                el.set({firstEmailReminder: true})
              } else if (delta <= -3 && !el.secondEmailReminder) {
                //Second email notification
                var mailOptions = {
                  from: env.email,
                  to: el.userEmail,
                  subject: `Reminder: It's time to complete your ${title}`,
                  html: `<p>${el.userName} - it's time to complete your bi-weekly acne check in over at </p><br><a href='https://madaesthetics.co/bootcamp'>madaesthetics.co</a>!
                  <p>As always, feel free to shoot me an email if you have any questions/comments/concerns!</p>
                  <p>Best,</p>
                  <p>Maddie</p>
                  <p>madaestheticsllc@gmail.com`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(info.response);
                  }
                });
                el.set({secondEmailReminder: true})
              } else if (delta <= -7 && !el.thirdEmailReminder) {
                //Last email notification
                var mailOptions = {
                  from: env.email,
                  to: el.userEmail,
                  subject: `Last Reminder: It's time to complete your ${title}`,
                  html: `<p>${el.userName} - it's time to complete your bi-weekly acne check in over at </p><br><a href='https://madaesthetics.co/bootcamp'>madaesthetics.co</a>!
                  <p>As always, feel free to shoot me an email if you have any questions/comments/concerns!</p>
                  <p>Best,</p>
                  <p>Maddie</p>
                  <p>madaestheticsllc@gmail.com`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(info.response);
                  }
                });
                el.set({thirdEmailReminder: true})
              } 
            }
          } else if (el.submitted && !el.reviewed) {
            el.set({status: 'Under Review'})
          } else {
            el.set({status: 'Complete'})
            el.set({active: true})
          }
        } else {
          let daysAway = Math.floor(delta)
          el.set({status: `${daysAway} days away`})
          el.set({active: false})
        }
        await el.save()
      }
      return next()
    }
  }