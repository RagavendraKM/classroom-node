const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

const validateLoginUserData = require('../config/validator/login')
const validateRegisterUserData = require('../config/validator/register')
const {registerApi, loginApi} = require('../controllers/api.controller')

const User = require('../models/Users')

router.get('/', (req, res) => {
  res.send("From API");
});

router.post('/register' , (req,res) => {
  console.log("IN REGISTER API")
  const { errors , isValid } = validateRegisterUserData(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  } 
    registerApi(req,res)
})

router.post('/login' , (req,res) => {
  console.log("IN LOGIN API")
  const { errors , isValid } = validateLoginUserData(req.body)

  if(!isValid) {
    return res.status(200).json(errors)
  }
    loginApi(req,res)
})

module.exports = router