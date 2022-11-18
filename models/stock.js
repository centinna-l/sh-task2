const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const stockSchema = mongoose.Schema(
  {
    stock: { type: String, required: true, unique: true },
    current_price: { type: Number, default: 100 },
    count: { type: Number, default: 10 },
    last_price: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
