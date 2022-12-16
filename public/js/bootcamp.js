function getCheckIn(target) {
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
  } else {
    let input = document.getElementById('defaultCheckInID')
    input.value = target.dataset.id
    let submit = document.getElementById('defaultCheckInSubmit')
    console.log(input.value)
    submit.click()
} 
  // if (target.dataset.checkin == 'first') {
  //     let input = document.getElementById('firstCheckInID')
  //     input.value = target.dataset.id
  //     let submit = document.getElementById('firstCheckInSubmit')
  //     console.log(input.value)
  //     submit.click()
      
  //     // fetch('/bootcamp/firstCheckIn', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-type': 'application/json'
  //     //   },
  //     //   body: JSON.stringify(data)
  //     // })
  //     // .then(response => console.log(response))
  //     // // .then(response => window.open(response.url))
  //     // .catch((error) => {
  //     //   console.log('Error:', error);
  //     // })
    
  //   } else if (target.dataset.checkin == 'second') {
  //       let input = document.getElementById('secondCheckInID')
  //       input.value = target.dataset.id
  //       let submit = document.getElementById('secondCheckInSubmit')
  //       console.log(input.value)
  //       submit.click()
  //   // } else if (target.data-checkIn == 'secondAcneMed') {
  //   //   fetch('/bootcamp/secondCheckInAcneMed', {
  //   //     method: 'GET',
  //   //     body: target.data-id
  //   //   }
  //   //   .catch((error) => {
  //   //     console.error('Error:', error);
  //   //   })
  //   //   )
  //   } else {
  //     fetch('/bootcamp/defaultCheckIn', {
  //       method: 'GET',
  //       body: target.dataset.id
  //     }
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     })
  //     )
  //   }

    }



  let fileCatcher = document.getElementById('checkInForm');
  let fileInput = document.getElementById('file-input');
  let fileListDisplay = document.getElementById('file-list-display');
  
  let fileList = [];
  let renderFileList, sendFile;
  
  // fileCatcher.addEventListener('submit', function (evnt) {
  // 	evnt.preventDefault();
  //   fileList.forEach(function (file) {
  //   	sendFile(file);
  //   });
  // });
  
  fileInput.addEventListener('change', function (evnt) {
 		fileList = [];
  	for (let i = 0; i < fileInput.files.length; i++) {
    	fileList.push(fileInput.files[i]);
    }
    renderFileList();
  });
  
  renderFileList = function () {
  	fileListDisplay.innerHTML = '';
    fileList.forEach(function (file, index) {
    	let fileDisplayEl = document.createElement('p');
      fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
      fileListDisplay.appendChild(fileDisplayEl);
    });
  };
  
  // sendFile = function (file) {
  // 	let formData = new FormData();
  //   let request = new XMLHttpRequest();
 
  //   formData.set('file', file);
  //   request.open("POST", 'https://jsonplaceholder.typicode.com/photos');
  //   request.send(formData);
  // };


    