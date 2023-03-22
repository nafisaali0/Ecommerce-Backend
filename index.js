const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 4000;
//routes
const authRouter = require("./routes/authRoutes");
const productcatagoryRouter = require("./routes/productRoutes");
const productRouter = require("./routes/productRoutes");
const blogRouter = require("./routes/blogsRoutes");
const blogcatagoryRouter = require("./routes/blogcatagoryRoutes");
const brandRouter = require("./routes/brandRoutes");
const colorRouter = require("./routes/colorRoutes");
const couponRouter = require("./routes/couponRoutes");
const enquaryRouter = require("./routes/enqRoutes");

const bodyParser = require("body-parser");
const { notFoundError, errorhandler } = require("./middlewares/errorHander");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.json())

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-catagory", productcatagoryRouter);
app.use("/api/blog-catagory", blogcatagoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/color", colorRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquary", enquaryRouter);

app.use(notFoundError);
app.use(errorhandler);

app.listen(port, () => {
  console.log(`Server is runnig on Port  ${port}`);
});
