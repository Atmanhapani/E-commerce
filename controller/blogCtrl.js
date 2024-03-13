const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

//!create blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "sucess",
      newBlog,
    });
  } catch (error) {
    throw new Error(erorr);
  }
});

//!update blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(erorr);
  }
});

//!get blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getBlog = await Blog.findById(id);
    const updateViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json(updateViews);
  } catch (error) {
    throw new Error(erorr);
  }
});

//!get all blogs
const getAllBLogs = asyncHandler(async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//!delete blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json({
      deleteBlog,
    });
  } catch (error) {
    throw new Error(erorr);
  }
});

//!like the blog
const liketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  //! Validate the format of the blogId
  try {
    validateMongoDbId(blogId);
  } catch (error) {
    //If the blogId is not valid, return an error response
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    // Find the blog which we want to like
    const blog = await Blog.findById(blogId);

    // Find the login user
    const loginUserId = req.user._id;

    // Find if user has disliked the blog
    const alreadyDisliked = blog.dislikes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadyDisliked) {
      // If the user has already disliked the blog, remove their dislike
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    }

    // Check if the user has already liked the blog
    const isLiked = blog.likes.includes(loginUserId);

    if (isLiked) {
      // If the user has already liked the blog, remove their like
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    } else {
      // If the user has not liked the blog, add their like
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    }
  } catch (error) {
    // If an error occurs during the database operations, return an error response
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//!dislike the blog
const disliketheBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  //! Validate the format of the blogId
  try {
    validateMongoDbId(blogId);
  } catch (error) {
    //If the blogId is not valid, return an error response
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    // Find the blog which we want to like
    const blog = await Blog.findById(blogId);

    // Find the login user
    const loginUserId = req.user._id;

    // Find if user has disliked the blog
    const alreadyLiked = blog.likes.find(
      (userId) => userId.toString() === loginUserId.toString()
    );

    if (alreadyLiked) {
      // If the user has already disliked the blog, remove their dislike
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    }

    // Check if the user has already liked the blog
    const isDisliked = blog.dislikes.includes(loginUserId);

    if (isDisliked) {
      // If the user has already liked the blog, remove their like
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    } else {
      // If the user has not liked the blog, add their like
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        {
          new: true,
        }
      );
      return res.json(updatedBlog);
    }
  } catch (error) {
    // If an error occurs during the database operations, return an error response
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBLogs,
  deleteBlog,
  liketheBlog,
  disliketheBlog
};
