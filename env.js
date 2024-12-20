require('dotenv').config({path: './config/.env'})

module.exports = {
    cryptoPW: process.env.cryptoPW,
    port: process.env.PORT,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    accessTokenSandbox: process.env.SQUARE_ACCESS_TOKEN_SANDBOX,
    DB_STRING: process.env.DB_STRING,
    session_secret: process.env.session_secret,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    email: process.env.email,
    emailPW: process.env.emailPW
}