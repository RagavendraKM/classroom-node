
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const Course = require('../../models/Users').Course;
const { authorize } = require('./token.controller');
const DashBoard = require('../../models/Users').DashBoard;

// Adding DashBoard API

function setDashBoardDetails(req, res) {
    console.log("Inside setDashBoardDetails API");
    console.log("req.body", req.body);
    Course.find({ ownerID: req.body.ownerID }, (err, course) => {
        if (err) {
            console.log("err in setGradeDetails POST ", err)
        } else {
            let newDetails = new DashBoard({
                ownerID: req.body.ownerID,
                grade: req.body.grade,
                gradeName: req.body.gradeName,
                class: req.body.class,
                date: req.body.date,
                time: req.body.time,
                day: req.body.day,
                month: req.body.month,
                year: req.body.year,
                schedulingType: req.body.schedulingType
            })
            await newDetails.save()
            .then()
        }
    })
}

// Dashboard API

//checking

function listTopics(auth) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.topics.list({
        pageSize: 10,
        courseId: "48606229307"
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const topics = res.data.topic;
        if (topics && topics.length) {
            console.log('Topics:', topics);
            topics.forEach((topic) => {
                console.log(`${topic.name} (${topic.id})`);
            });
        } else {
            console.log('No courses found.');
        }
    });
}

// Get Subjects taken by a teacher in roster page API

function listSubjects(req, res) {
    console.log("Inside listSubjects API");
    console.log("req.body", req.params);
    Course.find({ ownerID: req.params.id, subject: { $exists: true } }, (err, course) => {
        if (!course) {
            console.log("Inside not of course")
            addCourse(req, res);
        } else if (err) {
            console.log("Err in listSubjects ", err)
        } else {
            console.log(course);
            const name = course.map(course => course.name + ' : ' + course.subject)
            // const subject = [] = course.map(course => course.subject).toLocaleString()
            // const nameObj = {data:name}
            res.send(name);
        }
    })
}

// Get Subjects taken by a teacher in roster page API

//correct ide
function listCourses(auth) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.list({
        pageSize: 10,
        courseStates: "ACTIVE"
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const courses = res.data.courses;
        // console.log("COURSES", courses)
        if (courses && courses.length) {
            console.log('Courses:');
            courses.forEach((course) => {
                console.log(`${course.name} (${course.id})`);
            });
        } else {
            console.log('No courses found.');
        }
    });
    listTopics(auth)
}

function listAnnouncements(auth) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.announcements.list({
        pageSize: 10,
        courseId: "48606229307"
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const announcements = res.data.announcements;
        if (announcements && announcements.length) {
            console.log('announcements:');
            // console.log(announcements)
            announcements.forEach((announcement) => {
                console.log(`${announcement.text} (${announcement.id})`);
            });
        } else {
            console.log('No teachers found.');
        }
    });
    Course.find((err, courses) => {
        if (err) {
            console.log("ERR", err)
        } else {
            console.log("COURSES", courses)
        }
    })
}

function listTeachers(auth) {
    const classroom = google.classroom({ version: 'v1', auth });
    classroom.courses.teachers.list({
        courseId: "48606229307",
        // userId: "109333280458439280136"
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const teachers = res.data.teachers;
        if (teachers && teachers.length) {
            console.log('teachers:');
            // console.log(teachers)
            teachers.forEach((teacher) => {
                console.log(`${teacher.profile.name.givenName} ${teacher.profile.emailAddress} (${teacher.userId})`);
            });
        } else {
            console.log('No teachers found.');
        }
    });
}

// Get teacher email for google classroom page in roster

function getTeacherEmail(req, res) {
    Course.findOne({ name: req.body.name, section: req.body.section }, (err, course) => {
        if (err) {
            console.log(err)
        } else {
            fs.readFile('credentials.json', (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                authorize(JSON.parse(content), listTeachers);
            })
        }
    }).then(course => res.status(200).json(course))
        .catch(err => console.log(err))
}

// End teacher email for google classroom page in roster

// API for Courses
function getNameAndSection(req, res) {
    console.log("Inside getNameAndSection");
    Course.findOne({ name: req.body.name, section: req.body.section }, (err, course) => {
        if (!course) {
            console.log("Inside not of course")
            addCourse(req, res);
        } else if (err) {
            console.log("Err in getNameAndSection ", err)
        } else {
            console.log(course);
            res.json(course);
        }
    })
}

function addCourse(req, res) {
    console.log("Inside ADD")
    Course.findOne({ name: req.body.name, section: req.body.section }, async (err, course) => {
        if (course) {
            return res.status(400).json("Course already exists")
        } else {
            let newCourse = new Course({
                ownerID: req.body.ownerID,
                name: req.body.name,
                section: req.body.section,
                subject: req.body.subject
            })
            await newCourse.save()
                .then(fs.readFile('credentials.json', (err, content) => {
                    if (err) return console.log('Error loading client secret file:', err);
                    authorize(JSON.parse(content), addCourseToUI);
                }))
                .then(course => res.status(200).json(course))
                .catch(console.log(err))
        }
    })
}

function addCourseToUIm(auth) {
    console.log("Inside UIADD")
    const classroom = google.classroom({ version: 'v1', auth });
    Course.findOne({}, { '_id': 0, }, { sort: '-_id' }, (err, course) => {
        if (course) {

            classroom.courses.create({
                requestBody: {
                    ownerId: '109333280458439280136',
                    name: course.name,
                    section: course.section,

                }
            }, (err, res) => {
                if (err) {
                    console.log("Error while creating Course ", err)
                } else {
                    console.log("Course created ", res.data)
                }
            })
        } else {
            console.log("No records found")
        }
    })
}

function addCourseToUI(auth) {
    console.log("Inside UIADD")
    const classroom = google.classroom({ version: 'v1', auth });
    Course.find().sort({ _id: -1 }).limit(1).exec((err, course) => {
        console.log("COuurse", course)
        if (course) {
            classroom.courses.create({
                requestBody: {
                    ownerId: course.map(course => course.ownerID).toLocaleString(),
                    name: course.map(course => course.name).toLocaleString(),
                    section: course.map(course => course.section).toLocaleString()
                }
            }, (err, res) => {
                if (err) {
                    console.log("Error while creating Course ", err)
                } else {
                    console.log("Course created ", res.data.id)
                    classroom.courses.aliases.create({
                        courseId: res.data.id,
                        requestBody: { alias: `p:${res.data.name} ${res.data.section}` }
                    }, (err, alias) => {
                        if (err) {
                            console.log("err while creating alias", err)
                        } else {
                            console.log("Alias created", alias.data.alias)
                            Course.findOneAndUpdate({ name: res.data.name, section: res.data.section },
                                { $set: { alias: alias.data.alias } },
                                (err, gotCourse) => {
                                    if (err) {
                                        console.log("err while updating alias name ", err)
                                    } else {
                                        console.log("ALias added in db ", gotCourse)
                                    }
                                })
                        }
                    }
                    )
                }
            })
        } else {
            console.log("No records found")
        }
    })
}

// End of Courses API

function deleteCourse(req, res) {
    console.log("Inside DELETE")
    Course.findOne({ name: req.body.name, section: req.body.section }, async (err, course) => {
        if (course) {
            return res.status(400).json("Course already exists")
        } else {
            let newCourse = new Course({
                ownerID: req.body.ownerID,
                name: req.body.name,
                section: req.body.section
            })
            await newCourse.save()
                .then(fs.readFile('credentials.json', (err, content) => {
                    if (err) return console.log('Error loading client secret file:', err);
                    authorize(JSON.parse(content), addCourseToUI);
                }))
                .then(course => res.status(200).json(course))
                .catch(console.log(err))
        }
    })
}

function deleteCourseToUI(auth) {
    console.log("Inside UIDELETE")
    const classroom = google.classroom({ version: 'v1', auth });
    Course.findOne({}, { '_id': 0, }, { sort: '-_id' }, (err, course) => {
        if (course) {
            classroom.courses.create({
                requestBody: {
                    ownerId: course.ownerID,
                    name: course.name,
                    section: course.section
                }
            }, (err, res) => {
                if (err) {
                    console.log("Error while creating Course ", err)
                } else {
                    console.log("Course created ", res.data)
                }
            })
        } else {
            console.log("No records found")
        }
    })
}


module.exports = {
    listTeachers, listAnnouncements, listCourses,
    addCourseToUI, addCourse, getNameAndSection, getTeacherEmail, listSubjects
}