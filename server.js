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

// db.select('*').from('users').then(data =>{
//     // console.log(data)
// });

const app = express();
app.use(bodyparser.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send(database.users)
})

//signin
app.post('/signin', (req, res) =>{
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data =>{
            const isValide = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValide){
            return  db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})


//register
app.post('/register', (req, res) =>{
    const { email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                email: email,
                hash: hash
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new moment().format()
                }).then(user =>{
                    res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
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
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entires'))

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