var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bungleDB', {useNewUrlParser: true});

const Users = require('../models/users.js')
const bcrypt = require("bcryptjs");

module.exports = {
    async register (req, res) {
        await Users.findOne({
            username: req.body.username
        }, (err, user) => {
            if(err) console.log(err)
            if(!user)
            {
                const newUser = new Users({
                    username: req.body.username,
                    email : req.body.email,
                    password : bcrypt.hashSync(req.body.password, 10)
                })
                newUser.save().catch(err => console.log(err));
                res.send({
                    message: `Hello ${req.body.username}, you have been registered. Not that anything has really changed.`
                })
                console.log(`success ${req.body.username} ${req.body.email}`)
            }
            else
            {
                res.status(403).send({
                    error: `This username has been taken.`
                })
                console.log(`failure`)
            }
        })
    },
    async login (req, res) {
        await Users.findOne({
            username: req.body.username
        }, (err, user) => {
            if(err) console.log(err)
            if(!user)
            {
                res.status(403).send({ error: 'Incorrect username or password.'})
            }
            else if(!bcrypt.compareSync(req.body.password, user.password))
            {
                res.status(403).send({ error: 'Incorrect username or password.'})
            }
            else
            {
                res.send({
                    message: `Welcome ${req.body.username}! The test was successful.`,
                })
                console.log(`login successful`)
            }
        })
    }
}
