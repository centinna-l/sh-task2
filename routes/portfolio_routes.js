const express = require("express");
const { uploads } = require("../helper/uploads");
const { errorHandler } = require("../helper/error_handler");
const auth = require("../middlewares/auth");
const {
  activatePortfolio,
  fetchPortfolio,
} = require("../controllers/portfolio_controller");
const router = express.Router();
router.get("/", auth, uploads.none(), errorHandler(fetchPortfolio)); //fetch Portfolio
router.get("/activate", auth, uploads.none(), errorHandler(activatePortfolio)); //activate portfolio

module.exports = router;
