const express = require('express');
const router = express.Router();
const servicesController = require('../controller/servicesController');

router.get('/', servicesController.getServiceById);
router.post('/', servicesController.createService);
router.put('/:id', servicesController.updateServiceById);
router.delete('/:id', servicesController.deleteServiceById);

module.exports = router;
