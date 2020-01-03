const User = require('../models/Users').User
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

function registerApi(req, res) {

    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            return res.status(400).json("Email already exists")
        } else {
            let newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    else {
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    }
                })
            })
        }
    })
}

function loginApi(req, res) {
    let email = req.body.email
    let password = req.body.password
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log("USER",user)
        if (!user) {
            res.status(400).json("Email not found")
        } else {
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        payload = {
                            id: user.id,
                            email: user.email
                        }

                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 31556926
                        }, (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                    } else {
                        return res.status(400).json("Password incorrect")
                    }
                })
        }
    })

}

module.exports = { registerApi, loginApi }