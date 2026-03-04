const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting contact form' });
  }
};
