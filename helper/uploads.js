const multer = require("multer");
const storage = require("../middlewares/file-upload");
const uploads = multer({ storage: storage });

module.exports = { uploads };
