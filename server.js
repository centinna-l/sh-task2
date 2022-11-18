require("dotenv").config();

const app = require("./app");
const httpServer = require("http").createServer(app);
const PORT = process.env.PORT || 8000;
require("./helper/db");

httpServer.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
