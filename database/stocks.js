const { MESSAGES } = require("../helper/messages");
const Stock = require("../models/stock");
const Wallet = require("../models/wallet");
const { fetchPortfolioDB, updatePortfolioDB } = require("./portfolio");
const { fetchWalletDetailsDB, updateWalletMoneyDB } = require("./wallet");

const createStockDB = async (
  name,
  current_price = 100,
  last_price = 0,
  count = 10,
  status = true
) => {
  try {
    let checkStock = await fetchStockByFieldDB({ stock: name.trim() });
    if (checkStock.status) {
      return { status: false, error: MESSAGES.STOCK_FOUND };
    }
    let stock = new Stock({
      stock: name.trim(),
      current_price: parseFloat(current_price),
      count: parseInt(count),
      last_price,
      status,
    });
    let result = await stock.save();
    if (!result) {
      return { status: false, error: MESSAGES.STOCK_CREATE_FAILURE };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchStockDB = async () => {
  try {
    let result = await Stock.find({});
    if (!result) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const fetchStockByIdDB = async (sid) => {
  try {
    let result = await Stock.findById(sid);
    if (!result) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

// const fetchStockByFieldDB = async (data) => {
//   try {
//     let result = await Stock.findOne(data).exec();
//     if (!result) {
//       return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
//     }
//     return { status: true, data: result };
//   } catch (error) {
//     return { status: false, error: error.message };
//   }
// };

const updateStockDB = async (sid, data) => {
  try {
    console.log("update stock db", data[0]);
    if (data.count) {
      let fetchStock = await fetchStockByIdDB(sid);
      if (!fetchStock.status) {
        return { status: false, error: fetchStock.error };
      }
      let count = parseInt(data.count);
      if (count + fetchStock.data.count < 0) {
        return { status: false, error: MESSAGES.INVALID_STOCK_AMOUNT };
      }
      count = count + fetchStock.data.count;
    }
    let result = await Stock.findByIdAndUpdate(sid, { $set: data }).exec();
    if (!result) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const purchaseStock = async (user_id, stock_id, count) => {
  try {
    /**
     * Fetch stock details
     */
    let fetchStock = await fetchStockByIdDB(stock_id);
    if (!fetchStock.status || !fetchStock.data.status) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    console.log("Check count", parseInt(count), fetchStock.data.count);
    if (parseInt(count) > fetchStock.data.count) {
      return { status: false, error: MESSAGES.STOCK_PURCHASE_FAILED };
    }
    /**
     * Fetch wallet details
     */
    let fetchWallet = await fetchWalletDetailsDB(user_id);
    if (!fetchWallet.status) {
      return { status: false, error: MESSAGES.FETCH_WALLET_FAILED };
    }
    let prevwallet = parseInt(fetchWallet.data.wallet);

    if (
      parseInt(count) * parseFloat(fetchStock.data.current_price) >
      fetchWallet.data.wallet
    ) {
      return { status: false, error: MESSAGES.INSUFFICIENT_FUNDS };
    }
    //Update happening here - wallet
    let amount = -(
      parseInt(Math.abs(count)) * parseFloat(fetchStock.data.current_price)
    );
    let updateWallet = await updateWalletMoneyDB(user_id, amount);
    if (!updateWallet.status) {
      return { status: false, error: updateWallet.error };
    }
    let prevStockCount = parseInt(fetchStock.data.count);
    let stock = {
      ...fetchStock.data,
      count: fetchStock.data.count + parseInt(count),
    };
    console.log("stock", fetchStock.data._id);
    //Update happening here - stocks
    let updateStock = await updateStockDB(stock_id, {
      count: fetchStock.data.count + parseInt(count),
    });
    if (!updateStock.status) {
      let updatewallet = await updateWalletMoneyDB(user_id, prevwallet, true);
      return { status: false, error: updateStock.error };
    }
    /**
     *
     * Portfolio code is left
     *
     */
    //Update happening here
    let fetchPortfolio = await fetchPortfolioDB(user_id);
    if (!fetchPortfolio.status) {
      let stock = {
        ...fetchStock.data,
        count: prevStockCount,
      };
      let updatewallet = await updateWalletMoneyDB(user_id, prevwallet, true);
      let update = await updateStockDB(stock_id, stock);
      return { status: false, error: fetchPortfolio.error };
    }
    let shares = fetchPortfolio.data.shares;
    if (shares.length < 0) {
      let stock = {
        ...fetchStock.data,
        count: prevStockCount,
      };
      let update = await updateStockDB(stock_id, stock);
      let updatewallet = await updateWalletMoneyDB(user_id, prevwallet, true);
      return { status: false, error: MESSAGES.INTERNAL_SERVER_ERROR };
    }
    if (shares.length == 0) {
      shares.push({
        sid: stock_id,
        count: parseInt(Math.abs(count)),
        buying_price: fetchStock.data.current_price,
        selling_price: null,
        status: true,
        sold: false,
      });
      let update = await updatePortfolioDB(user_id, shares);
      if (!update.status) {
        let stock = {
          ...fetchStock.data,
          count: prevStockCount,
        };
        let update = await updateStockDB(stock_id, stock);
        let updatewallet = await updateWalletMoneyDB(user_id, prevwallet, true);
        return { status: false, error: update.error };
      }
      return { status: true, data: update.data };
    }
    // get the stock and update it here
    for (let i = 0; i < shares.length; i++) {
      if (shares[i]["sid"] == stock_id) {
        shares[i]["count"] = shares[i]["count"] + parseInt(Math.abs(count));
      }
    }
    let result = await updatePortfolioDB(user_id, shares);
    if (!result.status) {
      let stock = {
        ...fetchStock.data,
        count: prevStockCount,
      };
      let update = await updateStockDB(stock_id, stock);
      let updatewallet = await updateWalletMoneyDB(user_id, prevwallet, true);
      return { status: false, error: result.error };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};
module.exports = {
  createStockDB,
  fetchStockDB,
  fetchStockByIdDB,
  updateStockDB,
  purchaseStock,
};
