const jwt = require("jsonwebtoken");
const { fetchUserDetails } = require("../helper/fetch_user_details");
const { MESSAGES } = require("../helper/messages");
const secrete = process.env.secrete;

const auth = async (req, res, next) => {
  //get token from the header
  const token = req.header("x-auth-token");
  //Check if not token
  if (token == undefined) {
    return next(Error(MESSAGES.AUTH_TOKEN_UNDEFINED));
  }
  if (!token) {
    return next(Error(MESSAGES.AUTH_TOKEN_INVALID));
  }
  const decoded = jwt.verify(token, secrete);
  req.uid = decoded.uid;
  let user = await fetchUserDetails(req.uid);
  if (user.data == null) {
    return next(Error(MESSAGES.USER_NOT_FOUND));
  }
  req.user = user;
  console.log(process.platform);
  if (process.env.server == "dev") {
    console.log(req.url, ` [${new Date().toLocaleString()}]`);
  } else {
    let date = new Date(Date.now());
    let ist_date = date;
    ist_date.setHours(ist_date.getHours() + 5);
    ist_date.setMinutes(ist_date.getMinutes() + 30);
    console.log(req.url, ` [${ist_date.toLocaleString()}]`);
  }

  next();
};

module.exports = auth;
