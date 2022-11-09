const mongoose = require('mongoose')
const env = require('../env')


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.uj8w5cj.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


const connectDB = async () => {
  
  try {
    const conn = await mongoose.connect(env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'madaesthetics'
      // useFindAndModify: false,
      // useCreateIndex: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.log('failed to connect to database')
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB