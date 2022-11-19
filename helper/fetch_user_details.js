const { fetchUser } = require("../database/auth");
const { MESSAGES } = require("./messages");
const { ObjectId } = require("mongoose").Types;

const fetchUserDetails = async (_id) => {
  return new Promise(async (resolve, reject) => {
    if (!ObjectId.isValid(_id)) {
      resolve({ message: MESSAGES.USER_ID_NOT_VALID, data: null });
    }
    let user = await fetchUser({ _id }, {}, { select: "-password -__v" });
    if (!user.status) {
      resolve({ message: user.error, data: null });
    }

    resolve({ message: MESSAGES.USER_FOUND, data: user.data });
  });
};

module.exports = { fetchUserDetails };
