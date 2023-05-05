const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serviceRoutes = require('./route/serviceRoutes');
const blogRoutes = require('./route/blogRoutes');
const categoryRoutes = require('./route/categoryRoutes');
const projectsRoutes = require('./route/projectsRoutes');
const emailRoutes = require('./route/emailRoutes');
// const AppError=require('./utils/AppError')



const app = express();
app.use(express.json());
app.use(cors());

app.use('/service', serviceRoutes);
app.use('/blog', blogRoutes);
app.use('/blog/category', categoryRoutes);
app.use('/project', projectsRoutes);
app.use('/email', emailRoutes);




app.all("*", (req, res, next) => {
  // const err = new Error("ther os a errrasd")
  // err.statusCode=404
  // err.status="fial"
  // return next(new AppError("Page is not found", 404));
});

module.exports = app;
