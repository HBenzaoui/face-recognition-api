const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.json());

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
    res.send('This is working!')
})

//singin
app.post('/singin', (req, res) =>{
    if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password){
        res.json('success');
    } else {
        res.status(400,).json('error logging in!')
    }
})


//register
app.post('/register', (req, res) =>{
    
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