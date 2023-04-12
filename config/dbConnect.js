const { default: mongoose } = require("mongoose");
const DATABASE_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iiseuxv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const dbConnect = () => {
  try {
    const connection = mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected Succesfully");
  } catch (error) {
    console.log("datbase Error");
  }
};
module.exports = dbConnect;
