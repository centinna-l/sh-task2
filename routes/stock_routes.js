const express = require("express");
const { uploads } = require("../helper/uploads");
const { errorHandler } = require("../helper/error_handler");
const auth = require("../middlewares/auth");
const {
  fetchStocks,
  fetchStocksById,
  addStocks,
  buyStocks,
} = require("../controllers/stocks_controller");

const router = express.Router();
router.get("/", auth, uploads.none(), errorHandler(fetchStocks)); //fetch Stocks
router.post("/", auth, uploads.none(), errorHandler(addStocks)); //activate Stocks
router.get("/:sid", auth, uploads.none(), errorHandler(fetchStocksById)); //fetch stocks
router.post("/buy/:sid", auth, uploads.none(), errorHandler(buyStocks)); //fetch stocks

// router.post("/:sid", auth, uploads.none(), errorHandler(fetchStocksByField)); //fetch stocks

module.exports = router;
