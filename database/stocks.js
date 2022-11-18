const { MESSAGES } = require("../helper/messages");
const Stock = require("../models/stock");

const createStockDB = async ({
  name,
  current_price = 100,
  last_price = 0,
  count = 10,
  status = true,
}) => {
  try {
    let checkStock = await fetchStockByFieldDB({ stock: name.trim() });
    if (checkStock.status) {
      return { status: true, data: checkStock.data };
    }
    let stock = new Stock({
      stock: name.trim(),
      current_price,
      count,
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

const fetchStockByFieldDB = async (data) => {
  try {
    let result = await Stock.findOne(data).exec();
    if (!result) {
      return { status: false, error: MESSAGES.STOCK_NOT_FOUND };
    }
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

const updateStockDB = async (sid, data) => {
  try {
    // delete data["count"];
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
    if (count > fetchStock.data.count) {
      return { status: false, error: MESSAGES.STOCK_PURCHASE_FAILED };
    }
    let stock = { ...fetchStock.data, count: fetchStock.data.count + count };
    let updateStock = await updateStockDB(stock_id, stock);
    if (!updateStock.status) {
      return { status: false, error: MESSAGES.STOCK_PURCHASE_FAILED };
    }
    /**
     *
     * Portfolio code is left
     */
    return { status: true, data: result };
  } catch (error) {
    return { status: false, error: error.message };
  }
};
module.exports = {
  createStockDB,
  fetchStockDB,
  fetchStockByIdDB,
  fetchStockByFieldDB,
  updateStockDB,
  purchaseStock,
};
