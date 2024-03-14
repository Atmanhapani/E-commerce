const { json } = require("body-parser");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const User=require("../models/userModel");
const slugify = require("slugify");

//!create product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//!get product by id
const getaProduct = asyncHandler(async (req, res) => {
  //console.log("find single user");
  const { id } = req.params;
  //validateMongoDbId(id);
  try {
    const getProduct = await Product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//!get all products
const getallProduct = asyncHandler(async (req, res) => {
  try {
    //!filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //!sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //!limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //!pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("This page does not exist");
      }
    }

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//!update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ updateProduct });
  } catch (error) {
    throw new Error(error);
  }
});

//!delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const deleteProduct = await Product.findByIdAndDelete(id);
    res.json({ deleteProduct });
  } catch (error) {
    throw new Error(error);
  }
});

//!add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createProduct,
  getaProduct,
  getallProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
};
