const {
  activateWalletDB,
  fetchWalletDetailsDB,
  addMoneyDB,
} = require("../database/wallet");
const { MESSAGES } = require("../helper/messages");

const activateWallet = async (req, res, next) => {
  try {
    let user_id = req.user.data._id;
    let result = await activateWalletDB(user_id);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status.json({ message: MESSAGES.ACTIVATE_WALLET_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};

const fetchWallet = async (req, res, next) => {
  try {
    let user_id = req.user.data._id;
    let result = await fetchWalletDetailsDB(user_id);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ data: result.data });
  } catch (error) {
    return next(Error(error.message));
  }
};

const addMoney = async (req, res, next) => {
  try {
    let user_id = req.user.data._id;
    const { amount } = req.body;
    let result = await addMoneyDB(user_id, amount);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ message: MESSAGES.ADD_MONEY_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};

module.exports = { activateWallet, fetchWallet, addMoney };
