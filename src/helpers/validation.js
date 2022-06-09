const User = require("../models/user");

// check if there is a user
const findUser = async (email) => {
  return await User.findOne({ email });
};

// validate email
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // validate username live
  const validateUsername = async ( username) => {

    let a = false;
    do {
        let check = await User.findOne({ username });

        if(check){

            // Change username
            username += ((+new Date() * Math.random()).toString().substring(0, 1));
        a = true
        } else {
            a = false
        }
    } while(a)
    return username

  }

module.exports = {  validateEmail, findUser, validateUsername, validateUsername };