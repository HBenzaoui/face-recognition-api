const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        user:'postgres',
        password:'',
        database:'facerec',
    }
});

const app = express();
app.use(bodyparser.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send(database.users)
})

//signin
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
//register
app.post('/register', (req , res) => { register.handleRegister(req, res ,db, bcrypt) })
//profile/:userId
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
//Images
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageUrl', (req, res) => { image.handleAPICall(req, res)})

app.listen(process.env.PORT || 3000, () =>{
    console.log(`app is runnig on port ${process.env.PORT}`)
})

/*
/ --> res = this is working
/singin  --> POST = success/failed
/register--> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/