const FAQ = require("../models/faq");
const ExpressError = require("../utils/ExpressError");

// Create a new FAQ
const createFAQ = async (req, res) => {
  const { question, answer, category } = req.body;

  const faq = new FAQ({
    question,
    answer,
    category,
  });

  await faq.save();

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    data: faq,
  });
};

// Get all FAQs
const getAllFAQs = async (req, res) => {
  const faqs = await FAQ.find();

  res.status(200).json({
    success: true,
    data: faqs,
  });
};

// Get FAQ by ID
const getFAQById = async (req, res) => {
  const { id } = req.params;

  const faq = await FAQ.findById(id);

  if (!faq) {
    throw new ExpressError(404, "FAQ not found");
  }

  res.status(200).json({
    success: true,
    data: faq,
  });
};

// Update FAQ by ID
const updateFAQById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });

  if (!faq) {
    throw new ExpressError(404, "FAQ not found");
  }

  res.status(200).json({
    success: true,
    message: "FAQ updated successfully",
    data: faq,
  });
};

// Delete FAQ by ID
const deleteFAQById = async (req, res) => {
  const { id } = req.params;

  const faq = await FAQ.findByIdAndDelete(id);

  if (!faq) {
    throw new ExpressError(404, "FAQ not found");
  }

  res.status(200).json({
    success: true,
    message: "FAQ deleted successfully",
  });
};

module.exports = {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
};
