const express = require('express');
const bodyparser = require('body-parser');
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
        host:'127.0.0.1',
        user:'postgres',
        password:'',
        database:'facerec',
    }
});

db.select('*').from('users').then(data =>{
    // console.log(data)
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
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new moment().format()
    }).then(user =>{
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('Unable to register'))
})

//profile/:userId
app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user =>{
            if(user.length){
                res.json(user[0])
            } else {
                res.status(400).json('Not Found')
            }
    })
    .catch(err => res.status(400).json('error getting user'))
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