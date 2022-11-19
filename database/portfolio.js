const Portfolio = require("../models/portfolio");
const { MESSAGES } = require("../helper/messages");
const activatePortfolioDB = async (user_id, wallet_id) => {
  try {
    let checkPortfolio = await fetchPortfolioDB(user_id);
    if (checkPortfolio.status) {
      return { status: true, data: checkPortfolio.data };
    }
    let portfolio = new Portfolio({
      user_id,
      wallet_id,
      shares: [],
    });
    let result = await portfolio.save();
    if (!result) {
      return { status: false, error: MESSAGES.ACTIVATE_PORTFOLIO_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchPortfolioDB = async (user_id) => {
  try {
    let result = await Portfolio.findOne({ user_id })
      .populate([
        { path: "user_id", select: "-password" },
        { path: "wallet_id" },
      ])
      .exec();
    if (!result) {
      return { status: false, error: MESSAGES.UNABLE_TO_FETCH_PORTFOLIO };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const updatePortfolioDB = async (user_id, data) => {
  try {
    let result = await Portfolio.findOneAndUpdate(
      { user_id },
      { $set: data }
    ).exec();
    if (!result) {
      return { status: false, error: MESSAGES.UNABLE_TO_UPDATE_PORTFOLIO };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { activatePortfolioDB, fetchPortfolioDB, updatePortfolioDB };
