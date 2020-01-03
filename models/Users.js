const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const rosterSchema = new Schema({
  title: {
    type: String,
    value: ''
  },
  grade: {
    type: String,
    value: ''
  },
  roster: []
})

const roster = new Schema({
  scheduleTime: {
    type: String
  },
  rosterType: {
    type: String
  },

})

const courseSchema = new Schema({
  ownerID: {
    type: String
  },
  name: {
    type: String
  },
  section: {
    type: String
  }
})

const User = mongoose.model("users", userSchema)
const Course = mongoose.model("courses", courseSchema)

module.exports = { User, Course }