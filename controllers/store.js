
// Update store items (post)
    // Retrieve store items
    // Retrieve store item images
    // Create JSON store items for frontend
    // Create store item pages
// Create checkout page (post)
    // Validate cart
    // Generate idempotency key
    // Create checkout page w/ square api
    // Return checkout page to user


    const Store = require('../models/Store')
    const crypto = require('node:crypto');
    const env = require('../env');
    const path = require('path');
    const fs = require("fs");
    const cors = require('cors');
    const axios = require("axios");
    const { Client, Environment, ApiError } =  require('square');
    const client = new Client({
        accessToken: env.accessToken,
        environment: Environment.Production,
    });

      console.log(client.accessToken)


    module.exports = {
        updateStore: (req, res) => {
          // console.log('Web hook notification recieved, updating store')  
          let storeItems
 
            async function retrieveStoreItems() {
                try {
                  const response = await client.catalogApi.searchCatalogItems({
                    customAttributeFilters: [
                      {
                        customAttributeDefinitionId: 'SOHE7MR2IVQ73GE3BUFWN44F',
                        boolFilter: true
                      }
                    ]
                  });
                  console.log('Retrieved store items');
                  storeItems = response.result.items;
                  retrieveStoreItemImgs()
                } catch(error) {
                  console.log(error);
                }
              }
        
            async function retrieveStoreItemImgs() {    
                let index = 0;
                //IN SERIES
                for (const item of storeItems) {
                  let id = String(item.itemData.imageIds)
                  try {
                    const response = await client.catalogApi.retrieveCatalogObject(id);
                    storeItems[index].itemData.imgURL = response.result.object.imageData.url
                  } catch(error) {
                    console.log(error);
                  }
                  index++
                }
              
                console.log('Appended all img URLs')
                createJSONStoreItems()
              }
        
            function createJSONStoreItems() {
                //BigInt workaround
                const json = JSON.stringify(storeItems, (key, value) =>
                typeof value === "bigint" ? value.toString() + "n" : value
              , 2);
                fs.writeFile('public/store-items.json', json, 'utf8', function(err) {
                  if (err) throw err;
                });
                console.log('Updated JSON Store File')
                createStorePages()
              }
              function createStorePages() {
                //First, we delete all of the old pages
                let dirPath = 'public/products/';
                fs.readdir(dirPath, (err, files) => {
                    if (err) throw err;
                  
                    let deletePromises = files.map(file => {
                        return new Promise((resolve, reject) => {
                            fs.unlink(path.join(dirPath, file), err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    });
            
                    //Once all files are deleted, create the new pages
                    Promise.all(deletePromises)
                    .then(() => {
                        for (const item of storeItems) { 
                            let id = item.id;
                            fs.copyFile('public/product-template.html', `public/products/${id}.html`, (err) => {
                                if (err) throw err;
                                console.log(`Product ${id} page created`);
                            });
                        }
                    })
                    .catch(err => {
                        console.error("An error occurred while deleting files: ", err);
                    });
                });
            }
            function createStorePagesOld() {
                //First, we delete all of the old pages
                let dirPath = 'public/products/';
                fs.readdir(dirPath, (err, files) => {
                  if (err) throw err;
              
                  for (let file of files) {
                    fs.unlink(path.join(dirPath, file), err => {
                      if (err) throw err;
                    });
                  }
                }); 
              
                //Now, we create the new store pages
              for (const item of storeItems) { 
                    let id = item.id;
                    fs.copyFile('public/product-template.html', `public/products/${id}.html`, (err) => {
                    if (err) throw err;
                    console.log(`Product ${id} page created`);
                    });
                }
            }
            retrieveStoreItems()
            res.status(200).end() // Responding with 200 status
          },
        checkout: async (req, res) => {
          console.log('checkout function called from controller')

          let cart = req.body
          console.log(cart)
            let password = env.cryptoPW
            function validateCart(cart) {
                let validCart = true
                console.log('cart validated')
                //Take total from cart and compare it to what it should be based on storeItems variable
                return validCart
              }
            async function createCheckOutPage(cart) {
            let url
            let total = 0
            let shipping = 0
            cart.forEach(item => {
                total += (item.basePriceMoney.amount * Number(item.quantity))
            })
            // Old shipping rates
            // if (total < 10000) {
            //     shipping = 700
            // } else if (total >= 30000) {
            //     shipping = 1400
            // }
            if (total < 10000) {
              shipping = 700
            }
            let key = await getIdempotencyKey()
                try {
                const response = await client.checkoutApi.createPaymentLink({
                idempotencyKey: key,
                order: {
                    locationId: 'J2WJWF13GKN3W', //production locationId
                    // locationId: 'LY7R6151RVTQ7', //sandbox locationId
                    lineItems: cart,
                    // discounts: [
                    //   {
                    //     uid: 'blackfridaysale2022',
                    //     name: 'Black Friday Sale',
                    //     scope: 'LINE_ITEM',
                    //     percentage: '0'
                    //   },
                      
                    // ],
                    pricingOptions: {
                    autoApplyTaxes: true
                    }
                },
                checkoutOptions: {
                    askForShippingAddress: true,
                    shippingFee: {
                    name: 'Standard Shipping (5-8 business days)',
                    charge: {
                        amount: shipping,
                        currency: 'USD'
                    }
                    }
                }
                });
            
                console.log(response.result);
                url = response.result.paymentLink.url
            } catch(error) {
                console.log(error);
            }
            
            return url
            }
            async function getIdempotencyKey() {
                return await generateIdempotencyKey(password)
                }
            function generateIdempotencyKey(password) {
            let key
            return new Promise(resolve => {
                let salt = crypto.randomBytes(8).toString("hex")
                crypto.scrypt(password, salt, 32, (err, derivedKey) => {
                if (err) throw err;
                key = derivedKey.toString("base64");
                console.log('key', key)
                resolve(key)
                })
            })
            }
            if (validateCart(cart)) {
                let url = await createCheckOutPage(cart)
                console.log(url)
          // res.status(200).end() // Responding with 200 status
            res.json({checkoutPage: url})
        } else {
          //Respond with error message stating cart not valid
        }
        },
        checkoutSale: async (req, res) => {
          let cart = req.body
          let password = env.cryptoPW
          function validateCart(cart) {
              let validCart = true
              //Take total from cart and compare it to what it should be based on storeItems variable
              return validCart
            }
          async function createCheckOutPage(cart) {
          let url
          let total = 0
          let shipping = 0
          cart.forEach(item => {
              total += (item.basePriceMoney.amount * Number(item.quantity))
              
            })
          if (total < 10000) {
              shipping = 700
          }
          
          let key = await getIdempotencyKey()
              try {
              const response = await client.checkoutApi.createPaymentLink({
              idempotencyKey: key,
              order: {
                  locationId: 'J2WJWF13GKN3W', //production locationId
                  // locationId: 'LY7R6151RVTQ7', //sandbox locationId
                  lineItems: cart,
                  discounts: [
                    {
                      uid: 'ENSZ5ZCATDGGP6P2YR6GOLM5',
                      name: 'Black Friday 2024',
                      // scope: 'LINE_ITEM',
                      percentage: '15'
                    },
                    
                  ],
                  pricingOptions: {
                  autoApplyTaxes: true
                  }
              },
              checkoutOptions: {
                  askForShippingAddress: true,
                  shippingFee: {
                  name: 'Standard Shipping (5-8 business days)',
                  charge: {
                      amount: shipping,
                      currency: 'USD'
                  }
                  }
              }
              });
          
              console.log(response.result);
              url = response.result.paymentLink.url
          } catch(error) {
              console.log(error);
          }
          
          return url
          }
          async function getIdempotencyKey() {
              return await generateIdempotencyKey(password)
              }
          function generateIdempotencyKey(password) {
          let key
          return new Promise(resolve => {
              let salt = crypto.randomBytes(8).toString("hex")
              crypto.scrypt(password, salt, 32, (err, derivedKey) => {
              if (err) throw err;
              key = derivedKey.toString("base64");
              console.log('key', key)
              resolve(key)
              })
          })
          }
          if (validateCart(cart)) {
              let url = await createCheckOutPage(cart)
              console.log(url)
        // res.status(200).end() // Responding with 200 status
          res.json({checkoutPage: url})
      } else {
        //Respond with error message stating cart not valid
      }
      }
    }