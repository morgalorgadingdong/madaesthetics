// const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require('mongoose')
const passport = require('passport')
const logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
// const todoRoutes = require('./routes/todos')
const storeRoutes = require('./routes/store')
const bootcampRoutes = require('./routes/bootcamp')
const adminRoutes = require('./routes/admin')
const blogRoutes = require('./routes/blog')
const env = require('./env')
const cloudinary = require('cloudinary').v2
const bodyParser = require('body-parser')

require('./config/passport')(passport)

const http = require('http')
const fs = require("fs");
const path = require('path');
const router = express.Router();
const axios = require("axios");
const crypto = require('node:crypto');

const cors = require('cors');

connectDB()

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }));




app.use(
  session({
    secret: 'keybard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }) 
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Add headers before the routes are defined
// app.use(
//   cors({
//     origin:'http://localhost:8000',
//   })
// )

app.use('/', mainRoutes)
// app.use('/todos', todoRoutes)
app.use('/store', storeRoutes)
app.use('/bootcamp', bootcampRoutes)
app.use('/admin', adminRoutes)
app.use('/blog', blogRoutes)



//Sending back index page
// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// })
let port = env.port;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);


//Update store items whenever catalog update web hook fires
// app.post("/hook", (req, res) => {
//   retrieveStoreItems()
//   res.status(200).end() // Responding with 200 status
// })

// app.post("/checkout", async (req, res) => {
//   let cart = req.body
//   if (validateCart(cart)) {
//     let url = await createCheckOutPage(cart)
//     console.log(url)
//     // res.status(200).end() // Responding with 200 status
//     res.json({checkoutPage: url})
//   } else {
//     //Respond with error message stating cart not valid
//   }
// })

//Test change

app.get('/redirected', (req, res) => {
  let url = 'https://www.google.com'
  res.json({checkout: url})
})

// app.post("/test", async (req, res) => {
//   console.log('checkout request')
//   // console.log(req.body)
//   const idempotency = await generateIdempotencyKey(process.env.cryptoPW)
//   // generateIdempotencyKey(process.env.cryptoPW)
//   //   .then((res) => { console.log('random key', res)})
  
//   console.log(idempotency)
//   // res.json(req.data)
// })

//     const { Client, Environment, ApiError } =  require('square');
// const { resolve } = require("path");

//     const client = new Client({
//       accessToken: process.env.SQUARE_ACCESS_TOKEN,
//       environment: Environment.Production,
//     });

//     let storeItems
//Retrieve online store items
// async function retrieveStoreItems() {
//   try {
//     const response = await client.catalogApi.searchCatalogItems({
//       customAttributeFilters: [
//         {
//           customAttributeDefinitionId: 'SOHE7MR2IVQ73GE3BUFWN44F',
//           boolFilter: true
//         }
//       ]
//     });
//     console.log('Retrieved store items');
//     storeItems = response.result.items;
//     retrieveStoreItemImgs()
//   } catch(error) {
//     console.log(error);
//   }
// }

// // Grabbing all img URLs and appending them to each item as a property
// async function retrieveStoreItemImgs() {    
//   let index = 0;

//   //IN SERIES
//   for (const item of storeItems) {
//     let id = String(item.itemData.imageIds)
//     try {
//       const response = await client.catalogApi.retrieveCatalogObject(id);
//       storeItems[index].itemData.imgURL = response.result.object.imageData.url
//     } catch(error) {
//       console.log(error);
//     }
//     index++
//   }
  
//   // IN PARRALLEL
//   // await Promise.all(storeItems.map(async (item) => {
//   //   let id = String(item.itemData.imageIds)
//   //   let index2 = storeItems.id.indexOf(item.id)
//   //   console.log(item.itemData.name, index2)
//   //   try {
//   //     const response = await client.catalogApi.retrieveCatalogObject(id);
//   //     // console.log(`INDEX ${index}`)
//   //     // console.log(storeItems[index].itemData.name)
//   //     // console.log(response.result.object.imageData.url);
//   //     storeItems[index2].itemData.imgURL = response.result.object.imageData.url
//   //     // console.log(storeItems)
//   //     index++
//   //   } catch(error) {
//   //     console.log(error);
//   //   }
//   // }))


//   //TIMEOUT WORKAROUND
//   //Search square for all catalog images
//   //Filter out ones not a part of storeItems imgID's property
//   //Attach correct URL to matching storeItem's imgID's property

//   console.log('Appended all img URLs')
//   createJSONStoreItems()
// }



// //Creating JSON File with all store items in it for front end use
// function createJSONStoreItems() {
//   //BigInt workaround
//   const json = JSON.stringify(storeItems, (key, value) =>
//   typeof value === "bigint" ? value.toString() + "n" : value
// , 2);
//   fs.writeFile('public/store-items.json', json, 'utf8', function(err) {
//     if (err) throw err;
//   });
//   console.log('Updated JSON Store File')
//   createStorePages()
// }

// function createStorePages() {
//   for (const item of storeItems) { 
//     let id = item.id;
//     fs.copyFile('public/products/product-template.html', `public/products/${id}.html`, (err) => {
//       if (err) throw err;
//       console.log(`Product ${id} page created`);
//     });
//   }
// }

// // retrieveStoreItems(); //For development use only, remove for production


// function validateCart(cart) {
//   let validCart = true
//   //Take total from cart and compare it to what it should be based on storeItems variable
//   return validCart
// }

// function generateIdempotencyKey(password) {
//   let key
//   return new Promise(resolve => {
//     let salt = crypto.randomBytes(8).toString("hex")
//     crypto.scrypt(password, salt, 32, (err, derivedKey) => {
//       if (err) throw err;
//       key = derivedKey.toString("base64");
//       console.log('key', key)
//       resolve(key)
//     })
//   })
// }

// async function getIdempotencyKey() {
//   return await generateIdempotencyKey(password)
// }
  
  // let myPromise = new Promise(function(resolve, reject) {
  //   idempotency = crypto.scrypt(password, salt, 32, 
  //       (err, derivedKey) => {
  //         if (err)
  //           throw err;
  //         // Prints derived key after encoding
  //         key = derivedKey.toString("base64");
  //         return key
  //         console.log("The derived key is :", key);
  //       });
  //       console.log('prior to resolve', key)
  //       resolve(key)
  // })
  // myPromise.then(
  //   function(key) {
  //     idempotency = key
  //     console.log('then', key)    
  //   }
  // )
  // return new Promise(function (resolve, reject) {
  //   crypto.scrypt(password, salt, 32).then(
  //     (response) => {
  //       let result = response.toString('base64')
  //       resolve(result)
  //     },
  //       (err) => {
  //         reject(err)
  //       }
  //   )
  // })
  
  // crypto.scrypt(password, salt, 32, 
  //   (err, derivedKey) => {
  //     if (err)
  //       throw err;
  //     // Prints derived key after encoding
      
  //     key = derivedKey.toString("base64");
  //     console.log("The derived key is :", key);
  //   });


  
// async function createCheckOutPage(cart) {
//   let url
//   let total = 0
//   let shipping = 0
//   cart.forEach(item => {
//     total += (item.basePriceMoney.amount * Number(item.quantity))
//   })
//   if (total < 10000) {
//     shipping = 600
//   }
//   let key = await getIdempotencyKey()
//     try {
//     const response = await client.checkoutApi.createPaymentLink({
//       idempotencyKey: key,
//       order: {
//         locationId: 'J2WJWF13GKN3W', //production locationId
//         // locationId: 'LY7R6151RVTQ7', //sandbox locationId
//         lineItems: cart,
//         pricingOptions: {
//           autoApplyTaxes: true
//         }
//       },
//       checkoutOptions: {
//         askForShippingAddress: true,
//         shippingFee: {
//           name: 'Standard Shipping (5-8 business days)',
//           charge: {
//             amount: shipping,
//             currency: 'USD'
//           }
//         }
//       }
//     });
  
//     console.log(response.result);
//     url = response.result.paymentLink.url
//   } catch(error) {
//     console.log(error);
//   }
  
//   return url
// }