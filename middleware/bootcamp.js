const checkIn = require('../models/Bootcamp')

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
            if (!el.emailReminder) {
              // Send user email letting them know that they can now complete their next check in
              el.emailReminder == true
            }
            // If emailReminder is false, 
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