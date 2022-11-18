const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const portfolioSchema = mongoose.Schema(
  {
    user_id: { type: ObjectId, ref: "User", required: true },
    wallet_id: { type: ObjectId, ref: "Wallet" },
    shares: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
