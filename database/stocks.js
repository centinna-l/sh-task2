const { MESSAGES } = require("../helper/messages");
const Stock = require("../models/stock");
const Wallet = require("../models/wallet");
const { fetchPortfolioDB, updatePortfolioDB } = require("./portfolio");

const createStockDB = async (
  name,
  current_price = 100,
  last_price = 0,
  count = 10,
  status = true
) => {
  try {
    console.log("Name", name);
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
    let fetchStock = await fetchStockByIdDB(stock_id).exec();
    if (!fetchStock.status || !fetchStock.data.status) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    if (parseInt(count) > fetchStock.data.count) {
      return { status: false, error: MESSAGES.STOCK_PURCHASE_FAILED };
    }
    let fetchWallet = await fetchWallet;
    let prevStockCount = parseInt(fetchStock.data.count);
    let stock = {
      ...fetchStock.data,
      count: fetchStock.data.count + parseInt(count),
    };
    //Update happening here
    let updateStock = await updateStockDB(stock_id, stock);
    if (!updateStock.status) {
      return { status: false, error: MESSAGES.STOCK_PURCHASE_FAILED };
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
      return { status: false, error: MESSAGES.INTERNAL_SERVER_ERROR };
    }
    if (shares.length == 0) {
      shares.push({
        sid: stock_id,
        count,
        buying_price: fetchStock.data.current_price,
        selling_price: null,
        status: true,
        sold: false,
      });
      let update = await updatePortfolioDB(user_id, shares);
      if (!update.status) {
        return { status: false, error: update.error };
      }
      return { status: true, data: update.data };
    }
    // get the stock and update it here
    for (let i = 0; i < shares.length; i++) {
      if (shares[i]["sid"] == sid) {
        shares[i]["count"] = shares[i]["count"] + parseInt(count);
      }
    }
    let result = await updatePortfolioDB(shares);
    if (!result.status) {
      let stock = {
        ...fetchStock.data,
        count: prevStockCount,
      };
      let update = await updateStockDB(stock_id, stock);
      return { status: false, error: MESSAGES.UNABLE_TO_UPDATE_PORTFOLIO };
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
