const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const connection = mongoose.connect(process.env.DATABASE_URL);
    console.log("database connected Succesfully");
  } catch (error) {
    console.log("datbase Error");
  }
};
module.exports = dbConnect;
