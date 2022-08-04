const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const app = express()
const dbConfig = require('./config/db')
const cookieSession = require('express-session');
const router = require('./routes')
const io = require('./services/socketIo')
// require('./utils/cronSchedule')
const fs = require('fs')

require('dotenv').config()
require('./services/googleStrategy')
require('./services/jwtStrategy')
require('./models')

const COOKIE_SECRET = process.env.COOKIE_SECRET;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors( { origin: process.env.CLIENT_URL, credentials:true } ));

app.use(cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours,
    saveUninitialized: true,
    resave: false,
    name: 'dev-session',
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
        secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);

app.use('/api', router)

dbConfig.sync()
    .then( () => console.log('Conectado al servidor'))
    .catch( error => console.log(error))





process.on('uncaughtException', (err, origin) => {
    console.error('Vaya ha habido un error tipo: uncaughtException', err)
})

process.on('unhandledRejection', (err, origin) => {
    console.error('Vaya ha habido un error tipo:  unhandledRejection', err)
})


const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0"

const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    console.log(server.address())
});


io.attach(server)