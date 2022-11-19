const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const walletSchema = mongoose.Schema(
  {
    user_id: { type: ObjectId, required: true, unique: true },
    wallet: { type: Number, default: 0, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
