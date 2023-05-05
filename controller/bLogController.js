const Blog = require('../model/blogModel');

// Create new Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    //console.log("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLM")
    const imageSrc = req.file ? req.file.path : undefined; // add this line to get the path of the uploaded image file
    //console.log("qwertyuiop")

    const newBlog = new Blog({
      title, description, category, imageSrc
    });
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

    await newBlog.save();
    //console.log("1111111111111111111111111111111111111")
    //console.log(newBlog)

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Blog by ID
exports.updateBlogById = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    //console.log(title, description, category);
    const imageSrc = req.file ? req.file.path : undefined;
    //console.log(imageSrc);
    const newBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, category, imageSrc },
      { new: true }
    );
    if (!newBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const newBlog = await Blog.find();
    res.status(200).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const newBlog = await Blog.findById(req.params.id);
    if (!newBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete Blog by ID
exports.deleteBlogById = async (req, res) => {
  try {
    const newBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!newBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
