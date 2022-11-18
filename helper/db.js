const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGODB_URL,
  {
    useUnifiedTopology: true,

    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      return console.log("Error connecting to MongoDb Atlas", err.message);
    }
    console.log("Connected to MongoDB Atlas");
  }
);

module.exports = mongoose;
