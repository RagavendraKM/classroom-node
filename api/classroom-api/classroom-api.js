const express = require('express')
const router = express.Router()
const { getNameAndSection, getTeacherEmail, listSubjects } = require('../../controllers/classroom/classroom.controller')

router.get('/', (req, res) => {
    res.send("From Classroom");
});

router.get('/courses', (req, res) => {

});

router.post('/courses', (req, res) => {
    getNameAndSection(req,res);
});

router.get('/teacher', (req,res) => {
    getTeacherEmail(req,res)
})

router.get('/subjects/:id', (req, res) => {
    listSubjects(req,res)
});

module.exports = router