const express = require("express");
const {
  activateWallet,
  addMoney,
  fetchWallet,
} = require("../controllers/wallet_controller");
const { uploads } = require("../helper/uploads");
const { errorHandler } = require("../helper/error_handler");
const auth = require("../middlewares/auth");
const router = express.Router();
router.get("/", auth, uploads.none(), errorHandler(fetchWallet)); //fetch wallet
router.get("/activate", auth, uploads.none(), errorHandler(activateWallet)); //activate wallet
router.post("/add-money", auth, uploads.none(), errorHandler(addMoney)); //add-money to the wallet
// router.post("/google-signup", uploads.none(), errorHandler(googleSignUp));
// router.post("/login", uploads.none(), errorHandler(login));
// router.post("/google-login", uploads.none(), errorHandler(googleLogin));
// router.get("/getprofile", auth, uploads.none(), errorHandler(getprofile));

module.exports = router;
