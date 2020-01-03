module.exports = {
  mongoURI: "mongodb+srv://admin:admin@cluster0-pvipx.mongodb.net/classroom?retryWrites=true",
  secretOrKey: "secret",
  TOKEN_PATH : 'token.json',
  SCOPES : ['https://www.googleapis.com/auth/classroom.announcements',
    'https://www.googleapis.com/auth/classroom.courses',
    'https://www.googleapis.com/auth/classroom.rosters',
    'https://www.googleapis.com/auth/classroom.coursework.me',
    'https://www.googleapis.com/auth/classroom.coursework.students',
    'https://www.googleapis.com/auth/classroom.guardianlinks.students',
    'https://www.googleapis.com/auth/classroom.push-notifications',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos',
    'https://www.googleapis.com/auth/classroom.topics'
  ]
}