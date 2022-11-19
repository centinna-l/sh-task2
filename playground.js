const socketClient = require("socket.io-client");

const socket1 = socketClient(`http://localhost:8000`, {
  query: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2Mzc2NmNhMWFlNzYwYjA5YTc1YjBhZTAiLCJpYXQiOjE2Njg3MDkyMzB9.QnkF5eRJ-t76o6p2u6D9dDrrzf_2XJY4qtJ4aBY_4Pg",
  },
});

socket1.on("error", (data) => {
  console.log("{USER LOGGED IN 1}", data);
});
socket1.on("on-pricing", (data) => {
  //To trigger in the Fetch API (Conventional Model)
  console.log("{User Logged IN 1}", data);
});
