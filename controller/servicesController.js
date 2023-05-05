const Service = require('../model/serviceModel');

// Create new Service
exports.createService = async (req, res) => {
  try {
    const { icon, title, description, link } = req.body;
    const service = new Service({ icon, title, description, link });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all Services with pagination
exports.getAllServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Service.countDocuments();

    const pagination = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };

    const services = await Service.find().skip(startIndex).limit(limit);

    res.status(200).json({ services, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Service by ID
exports.updateServiceById = async (req, res) => {
  try {
    const { icon, title, description, link } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { icon, title, description, link },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete Service by ID
exports.deleteServiceById = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
