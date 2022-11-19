const { MESSAGES } = require("../helper/messages");
const Wallet = require("../models/wallet");

const activateWalletDB = async (user_id) => {
  try {
    let checkWallet = await fetchWalletDetailsDB(user_id);
    if (checkWallet.status) {
      return { status: true, data: checkWallet.data };
    }
    let wallet = new Wallet({
      user_id,
      wallet: 0,
      status: true,
    });
    let result = await wallet.save();
    if (!result) {
      return { status: false, error: MESSAGES.ACTIVATE_WALLET_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchWalletDetailsDB = async (user_id) => {
  try {
    let result = await Wallet.findOne({ user_id }).exec();
    if (!result) {
      return { status: false, error: MESSAGES.ACTIVATE_WALLET_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const updateWalletMoneyDB = async (user_id, amount) => {
  try {
    let fetchWallet = await fetchWalletDetailsDB(user_id);
    if (!fetchWallet.status) {
      return { status: false, error: MESSAGES.FETCH_WALLET_FAILED };
    }
    if (parseFloat(amount) + fetchWallet.data.wallet < 0) {
      return { status: false, error: MESSAGES.AMOUNT_INVALID };
    }
    let result = await Wallet.findOneAndUpdate(
      { user_id },
      { $inc: { wallet: parseFloat(amount).toFixed(2) } }
    );
    if (!result) {
      return { status: false, error: MESSAGES.ADD_MONEY_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = {
  activateWalletDB,
  fetchWalletDetailsDB,
  updateWalletMoneyDB,
};
