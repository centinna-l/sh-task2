const {
  createStockDB,
  updateStockDB,
  fetchStockDB,
  fetchStockByIdDB,
  purchaseStock,
} = require("../database/stocks");
const { MESSAGES } = require("../helper/messages");
const { ObjectId } = require("mongoose").Types;

const addStocks = async (req, res, next) => {
  try {
    const { name, current_price, count } = req.body;
    console.log(name);
    let result = await createStockDB(name, current_price, count);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ message: MESSAGES.STOCK_CREATE_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};

const updateStocks = async (req, res, next) => {
  try {
    let sid = req.params.sid;
    let result = await updateStockDB(sid, req.body);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.json({ message: MESSAGES.STOCK_UPDATE_SUCCESS });
  } catch (error) {
    return next(Error(error.message));
  }
};
const deleteStocks = async (req, res, next) => {
  try {
  } catch (error) {
    return next(Error(error.message));
  }
};
const buyStocks = async (req, res, next) => {
  try {
    let sid = req.params.sid;
    if (ObjectId.isValid(sid)) {
      return next(Error("Invalid Stock"));
    }
    const { count } = req.body;
    let result = await purchaseStock(req.user.data._id, sid, count);
    if (!result.status) {
      return next(Error("Unable to purchase stocks"));
    }
    return res.status(200).json({ message: "Stock purchased" });
  } catch (error) {
    return next(Error(error.message));
  }
};

const fetchStocks = async (req, res, next) => {
  try {
    let result = await fetchStockDB();
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ data: result.data });
  } catch (error) {
    return next(Error(error.message));
  }
};

const fetchStocksById = async (req, res, next) => {
  try {
    let sid = req.params.sid;
    let result = await fetchStockByIdDB(sid);
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ data: result.data });
  } catch (error) {
    return next(Error(error.message));
  }
};

const fetchStocksByField = async (req, res, next) => {
  try {
    const { name } = req.body;
    let result = await fetchStockByFieldDB({ name: name.trim() });
    if (!result.status) {
      return next(Error(result.error));
    }
    return res.status(200).json({ data: result.data });
  } catch (error) {
    return next(Error(error.message));
  }
};
module.exports = {
  addStocks,
  buyStocks,
  updateStocks,
  deleteStocks,
  fetchStocks,
  fetchStocksById,
  fetchStocksByField,
};
