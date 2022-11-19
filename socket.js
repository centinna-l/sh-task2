const app = require("./app");
const httpServer = require("http").Server(app);
const socketio = require("socket.io");
const socketOptions = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

const io = socketio(httpServer, socketOptions);
const jwt = require("jsonwebtoken");
const Stock = require("./models/stock");
const User = require("./models/user");
const { fetchStockDB } = require("./database/stocks");
const { ObjectId } = require("mongoose").Types;

const fetchUserID = async (socket) => {
  return new Promise(async (resolve, reject) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      await jwt.verify(
        socket.handshake.query.token,
        process.env.secrete,
        async (err, decoded) => {
          if (err) {
            resolve(null);
          }
          socket.decoded = decoded;
          if (socket.decoded === undefined) {
            return resolve(null);
          }
          let user = await User.findById(socket.decoded.uid).exec();
          if (!user) {
            resolve(null);
          }
          return resolve(socket.decoded.uid);
        }
      );
    } else {
      resolve(null);
    }
  });
};
io.on("connection", async (socket) => {
  const userId = await fetchUserID(socket);
  console.log("USER ID", userId);
  if (!userId) {
    return io.emit("verify-error", {
      error: "Not able to extract User ID",
    });
  }
  if (userId === null) {
    return socket.emit("verify-error", {
      error: "Not able to extract User ID",
    });
  }

  socket.join(userId);
  console.log("here beneath userID");
  let fetchStocks = await fetchStockDB();
  if (!fetchStocks.status) {
    return io.in(userId).emit("error", fetchStocks.error);
  }
  io.in(userId).emit("on-pricing", {
    data: fetchStocks.data,
  });
  // socket.on("fetch-stock-pricing", async () => {
  //   console.log("Inside fetch-stock-pricing");
  //   let fetchStocks = await fetchStockDB();
  //   if (!fetchStocks.status) {
  //     return io.in(userId).emit("error", fetchStocks.error);
  //   }
  //   console.log(fetchStocks.data);
  //   io.in(userId).emit("on-pricing", {
  //     data: fetchStocks.data,
  //   });
  // });
});

app.set("socket", io);
module.exports = httpServer;
