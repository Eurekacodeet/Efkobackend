const Blog = require('../model/blogModel');

// Create new Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageSrc = req.file ? req.file.path : undefined;

    const newBlog = new Blog({
      title,
      description,
      category,
      imageSrc,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Blog by ID
exports.updateBlogById = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const imageSrc = req.file ? req.file.path : undefined;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, category, imageSrc },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all Blogs with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find().skip(startIndex).limit(limit),
      Blog.countDocuments(),
    ]);

    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };

    res.status(200).json({ blogs, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single Blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Blog by ID
exports.deleteBlogById = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
