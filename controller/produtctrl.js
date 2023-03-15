const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

//create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//update a Product
const updateSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Product
const deleteSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleproduct by id
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProductById = await Product.findById(id);
    res.json(findProductById);
  } catch (error) {
    throw new Error(error);
  }
});

//get all product
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    let query = Product.find(JSON.parse(queryString));

    //Sorting
    if( req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy)
    }else{
      query = query.sort("-createdAt")
    }

    //Field
    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }else{
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page){
      const productCount = await Product.countDocuments();
      if(skip>= productCount) throw new Error("This Page does Not exist");
    }

    const product = await query;

    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateSingleProduct,
  deleteSingleProduct,
};
