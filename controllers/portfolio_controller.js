const {
  activatePortfolioDB,
  fetchPortfolioDB,
} = require("../database/portfolio");
const { fetchWalletDetailsDB } = require("../database/wallet");
const { MESSAGES } = require("../helper/messages");

const activatePortfolio = async (req, res, next) => {
  try {
    let wallet = await fetchWalletDetailsDB(req.user.data._id);
    if (!wallet.status) {
      return next(Error(MESSAGES.FETCH_WALLET_FAILED));
    }
    let result = await activatePortfolioDB(req.user.data._id, wallet.data._id);
    if (!result.status) {
      return next(Error(result.error));
    }
    if (result.data) {
      return res.status(200).json({ data: result.data });
    }
    return res
      .status(200)
      .json({ message: MESSAGES.ACTIVATE_PORTFOLIO_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};

const fetchPortfolio = async (req, res, next) => {
  try {
    let result = await fetchPortfolioDB(req.user.data._id);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ data: result.data });
  } catch (error) {
    return next(Error(error.message));
  }
};

module.exports = { activatePortfolio, fetchPortfolio };
