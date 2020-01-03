module.exports = function validateLoginUserData(data) {
  errors = {}

  data.email = data.email ? data.email : ""
  data.password = data.password ? data.password : ""

  if(!data.email) {
    errors.name = "Email is required"
  }

  if(!data.password) {
    errors.password = "Password is required"
  }

  return {
    errors,
    isValid : Object.keys(errors).length === 0
  }
}