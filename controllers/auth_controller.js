const argon2 = require("argon2");
const { MESSAGES } = require("../helper/messages");
const jwt = require("jsonwebtoken");
const { validateEmail } = require("../helper/validate_email");
const { fetchUser, createUser } = require("../database/auth");

const signup = async (req, res, next) => {
  try {
    const { name, username, email, password, dob, phone_no, gender } = req.body;
    if (!validateEmail(email)) {
      return next(Error(MESSAGES.EMAIL_NOT_VALID));
    }
    if (password.length < 6) {
      return next(Error(MESSAGES.PASSWORD_MIN_CHAR));
    }
    let getUser = await fetchUser(
      { username: username.trim() },
      {},
      { select: "-password -__v" }
    );
    if (getUser.status) {
      return next(Error(`${email} with username ${username} already Exists`));
    }
    let result = await createUser(req.body);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.json({ message: MESSAGES.USER_CREATE_SUCCESS });
  } catch (error) {
    return next(Error(error));
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let result = await fetchUser({ username: username.trim() }, {}, {});
  if (!result.status) {
    return next(Error(result.error));
  }
  if (await argon2.verify(result.data.password, password)) {
    const token = jwt.sign({ uid: result.data._id }, process.env.secrete);
    return res.json({
      token: token,
    });
  } else {
    return next(Error(MESSAGES.INVALID_CREDENTIALS));
  }
};
const getprofile = async (req, res, next) => {
  let user = req.user;
  return res.json({ data: user.data });
};

module.exports = {
  signup,
  login,
  getprofile,
};
