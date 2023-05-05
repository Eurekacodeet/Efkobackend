const express = require('express');
const emailController = require('../controller/emailController');

const router = express.Router();

// POST /email/send
router.post('/send', emailController.sendEmail);
router.post('/sendFromClient', emailController.sendEmailFromClient);
router.get('/viewInbox', emailController.viewEmails);
// router.get('/viewSent', emailController.fetchEmails);



module.exports = router;