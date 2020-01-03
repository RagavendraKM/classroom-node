
module.exports = function validateRegisterUserData(data) {
  let errors = {}
  let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  data.firstName = data.firstName ? data.firstName : ""
  data.lastName = data.lastName ? data.lastName : ""
  data.email = data.email ? data.email : ""
  data.password = data.password ? data.password : ""
 // data.password2 = data.password2 ? data.password2 : ""

  if(!data.firstName) {
    errors.firstName = "First Name is required"
  }

  if(!data.lastName) {
    errors.lastName = "Last Name is required"
  }

  if(!data.email) {
    errors.name = "Email is required"
  } else if (!reg.test(data.email)) {
    errors.email = "Email is not valid"
  }

  if(!data.password) {
    errors.password = "Password is required"
  }

  // if(!data.password2) {
  //   errors.password2 = "Password is required"
  // }

  if (data.password && (data.password.length <6 || data.password.length > 30)) {
    errors.password = "Password should be atleast 6 characters"
  }

  // if(data.password.localeCompare(data.password2) !== 0) {
  //   errors.password2 = "Password doesnt match"
  // }

  return {
    errors,
    isValid :  Object.keys(errors).length === 0
  }
}