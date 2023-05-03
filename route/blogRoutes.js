const express = require('express');
const router = express.Router();
const blogController = require('../controller/bLogController');
const multer = require('multer');
const {storage} = require("../cloudinary");

// Multer middleware configuration
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   }),
  // limits: {
  //   fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  // },
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/.(jpg|jpeg|png|gif)$/)) {
//       return cb(new Error('Only image files are allowed!'));
//     }
//     cb(null, true);
//   }
// });
//blog multer filter
const multerFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }  else {
    cb(new AppErorr("Please Enter Valid file type", 400));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB file size limit
  },
}); 
exports.uploadUserPhoto = upload.fields(
  
[{  name:'photo', maxCount:1}]);
// Create new blog
router.post('/', upload.single('image'), blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get single blog by ID
router.get('/:id', blogController.getBlogById);

// Update blog by ID
router.put('/:id', upload.single('image'), blogController.updateBlogById);

// Delete blog by ID
router.delete('/:id', blogController.deleteBlogById);

module.exports = router;
