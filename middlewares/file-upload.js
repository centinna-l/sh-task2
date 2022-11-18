const path = require("path");
const multer = require("multer");

//Storage for locally
//This Function simulates the File Storage and store the files in ./uploads
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    req.pathname = "./uploads";
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    req.filename = Date.now() + path.extname(file.originalname);
    console.log(req.filename);
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});
