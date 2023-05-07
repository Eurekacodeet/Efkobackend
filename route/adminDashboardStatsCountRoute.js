const express=require('express');
const router=express.Router();
const dashboardCountController=require('../controller/dashboardCountController')

router.get('/blogCount',dashboardCountController.countBlogs);
router.get('/emailCount',dashboardCountController.emailCount);
router.get('/projectCount',dashboardCountController.projectsCount);


module.exports = router










