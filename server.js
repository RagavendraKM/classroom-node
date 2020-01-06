
const fs = require('fs');
const SCOPES = require('./config/keys').SCOPES
const { listCourses, listAnnouncements, listTeachers, addCourseToUI } = require('./controllers/classroom/classroom.controller')
const { authorize } = require('./controllers/classroom/token.controller')

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const cors = require('cors');
const api = require('./api/api');
const classroomApi = require('./api/classroom-api/classroom-api');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());

app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true,
     useUnifiedTopology: true,
    useFindAndModify: false  }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.use(passport.initialize())

require('./config/passport')(passport)

app.use('/api' , api)

app.use('/classroom' , classroomApi)

const port = 5000; 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listCourses);
  authorize(JSON.parse(content), listAnnouncements);
  authorize(JSON.parse(content), listTeachers);
  // authorize(JSON.parse(content), addCourseToUI);
});


module.exports = {
  SCOPES,
  listCourses,
  app
};