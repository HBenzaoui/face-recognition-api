const express = require('express');
const bodyparser = require('body-parser');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const knex = require('knex')({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        user:'postgres',
        password:'',
        database:'facrec',
    }
});

const app = express();
app.use(bodyparser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'Hamza',
            email: 'hamzapdd@gmail.com',
            password: '123',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Hadjer',
            email: 'hadjer@gmail.com',
            password: '000',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) =>{
    res.send(database.users)
})

//signin
app.post('/signin', (req, res) =>{
    if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(404,).json('error logging in!')
    }
})


//register
app.post('/register', (req, res) =>{
    const { email, name, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
            id: '125',
            name: name,
            email: email,
            entries: 0,
            joined: new moment().format()
    })

    res.json(database.users[database.users.length-1]);
})

//profile/:userId
app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user)
        } 
    })
    if(!found){
        res.status(404).json('not found')
    }
})

//Images
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries)
        } 
    })
    if(!found){
        res.status(404).json('not found')
    }

})


app.listen(3000, () =>{
    console.log('app is runnig on post 3000')
})

/*
/ --> res = this is working
/singin  --> POST = success/failed
/register--> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/