const Blog = require("../models/blogsModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");

//create new blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//update a Blog
const updateSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const updatedBlog = await Blog.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//get singleBlog by id
const getSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const findBlogById = await Blog.findById(id);
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numView: 1 },
      },
      {
        new: true,
      }
    );
    res.json(findBlogById);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL Blog
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const getBlog = await Blog.find();
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});

//delete Blog
const deleteSingleBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteBlog = await Blog.findOneAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  updateSingleBlog,
  getSingleBlog,
  getAllBlog,
  deleteSingleBlog,
};
