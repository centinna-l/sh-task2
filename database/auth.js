const User = require("../models/user");
const argon2 = require("argon2");
const { MESSAGES } = require("../helper/messages");
const fetchUser = async (user, populate = {}, select = {}) => {
  try {
    let populateData = Object.keys(populate) == 0 ? null : populate;
    let selectData = Object.keys(select) == 0 ? null : select.select;
    let fetchuser = await User.findOne(user)
      .populate(populateData)
      .select(selectData)
      .exec();
    if (!fetchuser) {
      return { status: false, error: MESSAGES.UNABLE_FETCH_USER };
    }
    return { status: true, data: fetchuser };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const createUser = async (user) => {
  try {
    const { name, username, email, password, dob, phone_no, gender } = user;
    const hash = await argon2.hash(password);
    const data = new User({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      password: hash,
      phone_no: phone_no.trim(),
      profile_image: "",
      dob: new Date(dob),
      gender: gender.trim(),
      confirmation_code: "",
      status: true,
      isEmailVerified: false,
      isPhoneVerified: false,
      google_auth_token: "",
    });
    let result = await data.save();
    if (!user) {
      return { status: false, error: MESSAGES.CREATE_USER_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { fetchUser, createUser };
