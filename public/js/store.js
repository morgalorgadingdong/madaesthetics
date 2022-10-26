//If "cart" ID on page, Check local storage for cart object items and add the items in that object to the cart
//Else display "no items in cart"
//Add item to cart function
  //Add item to local storage object called "cart"
//Delete item from cart function
  //Remove item from local storage



// let storeItems = []

// async function fetchStoreItems() {
//   const response = await fetch('../store-items.json');
//   // waits until the request completes...
//   console.log(response)
//   storeItems = await response.json();
//   loadStoreItems()
// }

// fetchStoreItems()

// function loadStoreItems() {
//   let count = 0;
//   if (document.getElementById('store-items-container')) {
//     storeItems.forEach(item => {
//       createItemCard(item, count)
//       count++
//     });
//   } else if (document.getElementById('store-item-page')) {
//     createItemPage()
//   }
//   console.log(storeItems)
// }

// function createItemCard(item, count) {
//   let id = item.id;
//   let name = item.itemData.name;
//   let price = item.itemData.variations[0].itemVariationData.priceMoney.amount;
//   price = price.slice(0, price.length - 1)
//   price = Number(price)
//   price = price/100
//   let description = item.itemData.description;
//   let imgURL = item.itemData.imgURL;

//   let container = document.createElement('a')
//   container.classList.add('store-item-wrapper', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xxl-2')
//   container.setAttribute('onclick', `location.href='products/${id}.html';`);
//   let background = document.createElement('div')
//   background.style.backgroundImage = `url('${imgURL}')`;
//   background.classList.add('store-item-card', 'card');
//   let label = document.createElement('div')
//   label.classList.add('store-item-label');
//   let labelName = document.createElement('p')
//   labelName.innerHTML = name;
//   labelName.classList.add('store-item-name');
//   let labelPrice = document.createElement('p')
//   labelPrice.innerHTML = `$ ${price}`;
//   labelPrice.classList.add('store-item-price');
//   document.getElementById('store-items-container').appendChild(container);
//   container.appendChild(background);
//   background.appendChild(label);
//   label.appendChild(labelName);
//   label.appendChild(labelPrice);
// }

// function createItemPage() {
//   let url = window.location.pathname;
//   let filename = url.substring(url.lastIndexOf('/')+1);
//   let id = filename.slice(0, filename.lastIndexOf('.'));
//   console.log(id)
//   let index
//   for (let i = 0; i < storeItems.length; i++) {
//     if (storeItems[i].id == id) {
//       index = i;
//       i = storeItems.length;
//     }
//   }
//   let name = storeItems[index].itemData.name
//   let price = storeItems[index].itemData.variations[0].itemVariationData.priceMoney.amount
//   price = price.slice(0, price.length - 1)
//   price = Number(price)
//   price = price/100
//   let description = storeItems[index].itemData.description;
//   let imgURL = storeItems[index].itemData.imgURL;
//   console.log(index, name)
//   let nameHTML = document.getElementById('product-name')
//   let priceHTML = document.getElementById('product-price')
//   let imgHTML = document.getElementById('product-image')
//   let descriptionHTML = document.getElementById('product-description')
//   let breadCrumb = document.getElementById('product-breadcrumb')
//   nameHTML.innerHTML = name
//   priceHTML.innerHTML = `$ ${price}`
//   imgHTML.src = imgURL
//   descriptionHTML.innerHTML = description
//   breadCrumb.innerHTML += name
//   document.getElementById('qty').value = 1
// }


// fetch('../store-items.json').then(response => {
//   storeItems = response.json();
//   console.log(storeItems);
// });
// storeItems = storeItems.PromiseResult;
// console.log(storeItems)


// if (localStorage.length == 0) {
//   loadData()
// } else if (localStorage.length < 664) {
//   localStorage.clear()
//   loadData()
// } else {
//   let temp = Object.values(localStorage)
//   temp.forEach(el => {
//       if (el.charAt(0) == '/') {
//           monsterList.push(el)
//       } else if (el.charAt(0) == '{') {
//           monsterArray.push(JSON.parse(el))
//       } else {
//           console.log('check local storage for anomaly')
//       }
//   })
// }





//Testing cart
