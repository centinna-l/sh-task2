const {
  activateWalletDB,
  fetchWalletDetailsDB,
  updateWalletMoneyDB,
} = require("../database/wallet");
const { MESSAGES } = require("../helper/messages");

const activateWallet = async (req, res, next) => {
  try {
    let user_id = req.user.data._id;
    let result = await activateWalletDB(user_id);
    if (!result.status) {
      return next(Error(result.error));
    }
    if (result.data) {
      return res.status(200).json({ data: result.data });
    }
    return res.status(200).json({ message: MESSAGES.ACTIVATE_WALLET_SUCCESS });
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
    // if (amount <= 0) {
    //   return next(Error(MESSAGES.AMOUNT_INVALID));
    // }
    let result = await updateWalletMoneyDB(user_id, amount);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ message: MESSAGES.UPDATE_MONEY_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};

module.exports = { activateWallet, fetchWallet, addMoney };
