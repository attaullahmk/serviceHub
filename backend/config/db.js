const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/serviceHub";


connectDB()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function connectDB() {
  await mongoose.connect(MONGO_URL);
}
module.exports = connectDB;
