function getCheckIn(target) {
  // let target = e.path.find(el => {
  //   console.log(el)
  //   el.classList.contains('checkInItem')
  // })
  let data = {"id": target.dataset.id}
  console.log(target.dataset.id)
    if (target.dataset.checkin == 'first') {
      let input = document.getElementById('firstCheckInID')
      input.value = target.dataset.id
      let submit = document.getElementById('firstCheckInSubmit')
      console.log(input.value)
      submit.click()
      
      // fetch('/bootcamp/firstCheckIn', {
      //   method: 'POST',
      //   headers: {
      //     'Content-type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // })
      // .then(response => console.log(response))
      // // .then(response => window.open(response.url))
      // .catch((error) => {
      //   console.log('Error:', error);
      // })
    
    } else if (target.dataset.checkIn == 'second') {
      fetch('/bootcamp/secondCheckIn', {
        method: 'GET',
        body: target.dataset.id
      }
      .catch((error) => {
        console.error('Error:', error);
      })
      )
    // } else if (target.data-checkIn == 'secondAcneMed') {
    //   fetch('/bootcamp/secondCheckInAcneMed', {
    //     method: 'GET',
    //     body: target.data-id
    //   }
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   })
    //   )
    } else {
      fetch('/bootcamp/defaultCheckIn', {
        method: 'GET',
        body: target.dataset.id
      }
      .catch((error) => {
        console.error('Error:', error);
      })
      )
    }

    }


    