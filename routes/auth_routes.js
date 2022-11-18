const express = require("express");
const { signup, login, getprofile } = require("../controllers/auth_controller");
const { uploads } = require("../helper/uploads");
const { errorHandler } = require("../helper/error_handler");
const auth = require("../middlewares/auth");
const router = express.Router();
router.post("/signup", uploads.none(), errorHandler(signup));
// router.post("/google-signup", uploads.none(), errorHandler(googleSignUp));
router.post("/login", uploads.none(), errorHandler(login));
// router.post("/google-login", uploads.none(), errorHandler(googleLogin));
router.get("/getprofile", auth, uploads.none(), errorHandler(getprofile));

module.exports = router;
