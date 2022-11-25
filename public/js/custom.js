//Create storeItems variable from JSON
//Check local storage for cart items and update cart variable with items if present
//Check which page we're on based on elements present
  //If store, buid store cards
  //If product page, build product page html
  //If cart, build cart html

let cart = []
let checkoutCart = []
let storeItems = []
class CartItem{
  constructor(name, quantity, amount, category) {
    this.name = name;
    this.quantity = quantity;
    this.amount = amount
    this.category = category
    // Object.defineProperty(this.baseMoney, 'amount', {
    //   value: amount,
    // })
    // Object.defineProperty(this.baseMoney, 'currency', {
    //   value: 'USD',
    // })
  }
  updateQty(x) {
    this.quantity = x
  }
}

//On page load, check local storage for cart array
  //If exists, copy data from local storage to cart variable
function checkLocalStorageCart() {
  if (localStorage.length > 0) {
    let temp = Object.values(localStorage)
    temp.forEach(item => {
      cart.push(JSON.parse(item))
    })
  }
}
checkLocalStorageCart()

async function fetchStoreItems() {
  const response = await fetch('../store-items.json');
  storeItems = await response.json();
  if (document.getElementById('store-items-container')) {
    loadStoreItems()
    createItemFilterBtns()
  } else if (document.getElementById('store-item-page')) {
    createItemPage()
  } else if(document.getElementById('cart-container')) {
    buildCartHTML()
  }
}

fetchStoreItems()
let allFiltersBtn
let filterBtns
let activeFilters = []
let filterAll = true

function loadStoreItems() {
  let count = 0;
  storeItems.forEach(item => {
    createItemCard(item, count)
    count++
  })
}

function updateStoreItemsVisibility() {
  let items = document.getElementsByClassName('store-item-wrapper')
  if (filterAll) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].classList.contains('hidden')){
        items[i].classList.remove('hidden')
      }
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      let category = items[i].dataset.category
      if (activeFilters.indexOf(category) < 0) {
        items[i].classList.add('hidden')
        console.log('hidden',items[i], category, activeFilters.indexOf(category))
      } else if (items[i].classList.contains('hidden')) {
        items[i].classList.remove('hidden')
      }
    }
  }
  console.log(items)
  console.log(activeFilters)
}

function createItemFilterBtns() {
  let count = 0;
  let filters = []
  let filter
  storeItems.forEach(item => {
    filter = item.itemData.variations[0].customAttributeValues["Square:c23a60de-7fd4-411b-ab54-9f2449b423ef"].stringValue
    if (!filters.indexOf(filter)) {
      filters.push(filter)
    }
  })
  let w = window.innerWidth;
  if (w >= 992) {
    document.getElementById('filter-list-container').classList.remove('collapse')
  }
}

function toggleAllFilters(e) {
  let target = e.target
  filterAll = true
  filterBtns = document.getElementsByClassName('filter-toggle')
  target.checked = true
  for (let i = 0; i < filterBtns.length; i++) {
    filterBtns[i].checked = false
  }
  activeFilters = []
  updateStoreItemsVisibility()
}

function toggleIndividualFilter(e) {
  let target = e.target;
  let label = target.nextElementSibling
  if (activeFilters.indexOf(label.innerHTML) >= 0){
    activeFilters.splice(activeFilters.indexOf(label.innerHTML), 1)
  } else {
    activeFilters.push(label.innerHTML)
  }
  filterAll = false;
  allFiltersBtn = document.getElementById('filter-all')
  allFiltersBtn.checked = false
  
  updateStoreItemsVisibility()
}


function createCartItem() {
  console.log(storeItems)
  let name = document.getElementById('product-name').innerHTML
  let qty = document.getElementById('qty').value
  let price = document.getElementById('product-price').innerHTML
  let index
  let i = 0
  storeItems.forEach(el => {
    if (el.itemData.name == name) {
      index = i 
    } else {
      i++
    }
  })
  console.log(name, index)
  let category = storeItems[index].itemData.variations[0].customAttributeValues["Square:c23a60de-7fd4-411b-ab54-9f2449b423ef"].stringValue
  console.log('Created..',name, qty, price)
  let item = new CartItem(name, qty, price, category)
  let itemExists = false
  cart.forEach(el => {
    if (el.name == item.name) {
      el.quantity =Number(el.quantity) + Number(item.quantity)
      itemExists = true
      updateLocalStorageCart()
    }
  })
  if (!itemExists){addToCart(item)}
  window.open("../cart.html", '_self')
}

function addToCart(item) {
  cart.push(item)
  updateLocalStorageCart()
}

function removeFromCart(item) {
  console.log('Removed', item.target.dataset.name)
  let name = item.target.dataset.name
  console.log('Before', cart)
  cart = cart.filter(el => el.name != name)
  console.log('After', cart)
  item.target.parentNode.remove();
  updateLocalStorageCart()
  cartQtyUpdate()
}

// function updateItemQty(item) {
//   cart.forEach(el => {
//     if (el.name == item.name) {
//       el.quantity = item.quantity
//     }
//   })
//   updateLocalStorageCart()
// }

function emptyCart() {
  cart = []
  localStorage.clear()
}

function updateLocalStorageCart() {
  localStorage.clear()
  let index = 0
  console.log(cart)
  cart.forEach(item => {
    localStorage.setItem(index, JSON.stringify(item))
    index++
  })
  // if (document.getElementById('cart')) {updateCart()}
}

function buildCartHTML() {
  let container = document.getElementById('cart-container');
  if (cart.length < 1) {
    document.getElementById('cart-bottom-btns').remove()
    let emptyCartMsg = document.createElement('p')
    emptyCartMsg.innerHTML = 'Looks like your cart is empty.'
    container.appendChild
  } 
  document.getElementById('empty-cart-msg').remove()
  let total = 0
  cart.forEach(item => {
    let index
    storeItems.forEach(item2 => {
      if (item2.itemData.name == item.name) {
        index = storeItems.indexOf(item2)
      }
    })
    console.log(storeItems)
    if (storeItems[index]){
      let name = item.name
    let price = item.amount
    let qty = item.quantity
    let imgURL = storeItems[index].itemData.imgURL;
    let itemContainer = document.createElement('div')
    itemContainer.classList.add('col-12', 'd-flex', 'align-items-center', 'mb-3')
    let imgHTML = document.createElement('div')
    imgHTML.style.backgroundImage = `url('${imgURL}')`;
    imgHTML.classList.add('col-2', 'store-item-card')
    let itemID = storeItems[index].id
    imgHTML.setAttribute('onclick', `location.href='products/${itemID}.html'`);
    let nameHTML = document.createElement('p')
    nameHTML.innerHTML = name
    nameHTML.classList.add('col-4', 'cart-item-text')
    let qtyHTML = document.createElement('input')
    qtyHTML.value = qty
    qtyHTML.type = 'number'
    qtyHTML.step = '1'
    qtyHTML.min = '1'
    qtyHTML.max = '1000'
    qtyHTML.setAttribute('data-name', name)
    // qtyHTML.readOnly = true
    qtyHTML.classList.add('qty-input')
    let priceHTML = document.createElement('p')
    priceHTML.innerHTML = price
    priceHTML.classList.add('cart-item-text', 'col-2')
    let qtyContainer = document.createElement('div')
    qtyContainer.classList.add('col-2', 'd-flex', 'align-content-center')
    let qtyLabel = document.createElement('p')
    qtyLabel.innerHTML = 'Qty'
    qtyLabel.classList.add('cart-item-text')
    let closeBtn = document.createElement('span')
    closeBtn.classList.add('col-1', 'col-sm-2', 'close')
    closeBtn.setAttribute('data-name', name)
    closeBtn.setAttribute('onclick', `removeFromCart(event)`);
    closeBtn.innerHTML = 'x'
    price = Number(price.slice(price.indexOf(' ') + 1))
    qtyHTML.setAttribute('data-price', price)
    qty = Number(qty)
    total += (price * qty)
    qtyContainer.append(qtyLabel, qtyHTML)
    itemContainer.append(imgHTML, nameHTML, priceHTML, qtyContainer, closeBtn)
    container.append(itemContainer)
    
    }
  })
  let subtotalHTML = document.createElement('p')
  subtotalHTML.innerHTML = `Subtotal: $ ${total}`
  subtotalHTML.classList.add('col-12', 'text-right')
  subtotalHTML.id = 'subtotal'
  let shippingHTML = document.createElement('p')
  shippingHTML.classList.add('col-12', 'text-right')
  shippingHTML.id = 'shipping'
  let totalHTML = document.createElement('p')
  if (total >= 100) {
    shippingHTML.innerHTML = `Est shipping: FREE`
  } else if (total > 0) {
    shippingHTML.innerHTML = `Est shipping: $ 6`
    total = total + 6
  } else {
    shippingHTML.innerHTML = `Est shipping: 0`
  }
  totalHTML.innerHTML = `Total: $ ${total}`
  totalHTML.classList.add('col-12', 'text-right')
  totalHTML.id = 'total'
  container.append(subtotalHTML)
  container.append(shippingHTML)
  container.append(totalHTML)
  container.addEventListener('input', cartQtyUpdate);
}

function cartQtyUpdate() {
  //Calculate new total
  let quantities = document.getElementsByClassName('qty-input')
  total = 0
  for (let i = 0; i < quantities.length; i++) {
    let increment = quantities[i].value * quantities[i].dataset.price
    total += increment
    //Update cart object
    for (let j = 0; j < cart.length; j++) {
      if (cart[j].name == quantities[i].dataset.name) {
        console.log('match')
        cart[j].quantity = quantities[i].value
      }
    }
  }
  updateLocalStorageCart()
  updateCartTotalValue(total)
  //Call updateCartTotal function
}

function updateCartTotalValue(total) {
  totalHTML = document.getElementById('total')
  shippingHTML = document.getElementById('shipping')
  subtotalHTML = document.getElementById('subtotal')
  subtotalHTML.innerHTML = `Subtotal: ${total}`
  if (total >= 100) {
    shippingHTML.innerHTML = `Est shipping: FREE`
  } else if (total > 0) {
    shippingHTML.innerHTML = `Est shipping: $ 6`
    total = total + 6
  } else {
    shippingHTML.innerHTML = `Est shipping: `
  }
  totalHTML.innerHTML = `Total: $ ${total}`
}

// if (document.getElementById('cart-container')) {buildCartHTML()}

function createItemCard(item) {
  console.log(item)
  let id = item.id;
  let name = item.itemData.name;
  let price = item.itemData.variations[0].itemVariationData.priceMoney.amount;
  let category
  if (item.itemData.variations[0].customAttributeValues["Square:c23a60de-7fd4-411b-ab54-9f2449b423ef"].stringValue) {
    category = item.itemData.variations[0].customAttributeValues["Square:c23a60de-7fd4-411b-ab54-9f2449b423ef"].stringValue
  }
  let imgURL
  if (item.itemData.imgURL) {
    imgURL = item.itemData.imgURL;
  }
  price = price.slice(0, price.length - 1)
  price = Number(price)
  price = price/100
  // let description = item.itemData.description;
  let container = document.createElement('a')
  container.classList.add('store-item-wrapper', 'col-6', 'col-md-4', 'col-xl-3')
  container.setAttribute('onclick', `location.href='products/${id}.html';`);
  container.setAttribute('data-category', category)
  let background = document.createElement('div')
  background.style.backgroundImage = `url('${imgURL}')`;
  background.classList.add('store-item-card', 'card');
  let label = document.createElement('div')
  label.classList.add('col-12', 'd-flex', 'justify-content-between');
  let labelName = document.createElement('p')
  labelName.innerHTML = name;
  labelName.classList.add('col-9', 'p-0');
  let labelPrice = document.createElement('p')
  labelPrice.innerHTML = `$ ${price}`;
  labelPrice.classList.add('col-3', 'p-0', 'text-right');
  document.getElementById('store-items-container').appendChild(container);
  container.appendChild(background);
  container.appendChild(label);
  label.appendChild(labelName);
  label.appendChild(labelPrice);
}
// function createItemCardOld(item) {
//   let id = item.id;
//   let name = item.itemData.name;
//   let price = item.itemData.variations[0].itemVariationData.priceMoney.amount;
//   let category = item.itemData.variations[0].customAttributeValues["Square:c23a60de-7fd4-411b-ab54-9f2449b423ef"].stringValue
//   price = price.slice(0, price.length - 1)
//   price = Number(price)
//   price = price/100
//   let description = item.itemData.description;
//   let imgURL = item.itemData.imgURL;

//   let container = document.createElement('a')
//   container.classList.add('store-item-wrapper', 'col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'col-xxl-2')
//   container.setAttribute('onclick', `location.href='products/${id}.html';`);
//   container.setAttribute('data-category', category)
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

function toggleShowHideFilters() {
  let filterList = document.getElementById('filter-list')
  if (filterList.classList.contains('hidden')) {
    filterList.classList.remove('hidden')
  } else {
    filterList.classList.add('hidden')
  }
  console.log('showhide filters')
}

function createItemPage() {
  let url = window.location.pathname;
  let filename = url.substring(url.lastIndexOf('/')+1);
  let id = filename.slice(0, filename.lastIndexOf('.'));
  console.log(id)
  let index
  for (let i = 0; i < storeItems.length; i++) {
    if (storeItems[i].id == id) {
      index = i;
      i = storeItems.length;
    }
  }
  let name = storeItems[index].itemData.name
  let price = storeItems[index].itemData.variations[0].itemVariationData.priceMoney.amount
  price = price.slice(0, price.length - 1)
  price = Number(price)
  price = price/100
  let description = storeItems[index].itemData.description;
  let imgURL = storeItems[index].itemData.imgURL;
  console.log(index, name)
  let nameHTML = document.getElementById('product-name')
  let priceHTML = document.getElementById('product-price')
  let imgHTML = document.getElementById('product-image')
  let descriptionHTML = document.getElementById('product-description')
  let breadCrumb = document.getElementById('product-breadcrumb')
  nameHTML.innerHTML = name
  priceHTML.innerHTML = `$ ${price}`
  imgHTML.src = imgURL
  descriptionHTML.innerHTML = description
  breadCrumb.innerHTML += name
  document.getElementById('qty').value = 1
}


function translateCartData() {
  checkoutCart = []
  cart.forEach(item => {
    let discount = '20'
    let newAmount = item.amount.slice(2)
    newAmount = Number(newAmount) * 100
    let checkoutItem
    if (item.category == 'Black Friday') {
      checkoutItem = {
        name: item.name,
        quantity: String(item.quantity),
        basePriceMoney: {
          amount: newAmount,
          currency: 'USD'
        }
      }
    } else {
      checkoutItem = {
        name: item.name,
        quantity: String(item.quantity),
        basePriceMoney: {
          amount: newAmount,
          currency: 'USD'
        },
        appliedDiscounts: [
          {
            discountUid: 'blackfridaysale2022'
          }
        ],
      }
    }
    
    checkoutCart.push(checkoutItem)
  })
  console.log(checkoutCart)
}

function checkout() {
  translateCartData()
  fetch('/store/checkout', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkoutCart),
  })
  .then((response) => response.json())
  .then((data) => {
    window.open(data.checkoutPage, '_self');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

function bootcamp() {
  fetch('/bootcamp', {
    method: 'GET',
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


function rotateFilterArrow() {
  let arrow = document.getElementById('filter-arrow')
  if (arrow.classList.contains('rotate-180')) {
    arrow.classList.remove('rotate-180')
  } else {
    arrow.classList.add('rotate-180')
  }
  console.log('Rotate 180')
}



//ANIMATIONS
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal')
    } else {
      entry.target.classList.remove('reveal')
    }
  })
})
const animateElements = document.querySelectorAll('.animate')
animateElements.forEach((el) => observer.observe(el));

// function redirectTest() {
//   fetch('/redirected', {
//     method: 'get'
//   })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Success:', data);
//     window.open(data.checkoutPage)
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   })
// }

