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
     useUnifiedTopology: true  }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.use(passport.initialize())

require('./config/passport')(passport)

app.use('/api' , api)

app.use('/classroom' , classroomApi)

const port = 5000; 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;