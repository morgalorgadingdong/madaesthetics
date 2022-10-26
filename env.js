require('dotenv').config({path: './config/.env'})

module.exports = {
    cryptoPW: process.env.cryptoPW,
    port: process.env.PORT,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    dbString: process.env.DB_STRING
}