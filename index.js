const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 4000;
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const blogRouter = require("./routes/blogsRoutes");
const bodyParser = require("body-parser");
const { notFoundError, errorhandler } = require("./middlewares/errorHander");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);

app.use(notFoundError);
app.use(errorhandler);

app.listen(port, () => {
  console.log(`Server is runnig on Port  ${port}`);
});
