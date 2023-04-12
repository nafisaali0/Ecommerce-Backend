const { default: mongoose } = require("mongoose");
const MONGODB_URI = process.env.DATABASE_URL;
const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected Succesfully");
  } catch (error) {
    console.log("datbase Error");
  }
};


module.exports = dbConnect;
