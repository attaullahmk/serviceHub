const Category = require("../models/category");
const ExpressError = require("../utils/ExpressError");

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description,
  });

  await category.save();

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
};

// Get all categories
const getAllCategories = async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    data: categories,
  });
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ExpressError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

// Update category by ID
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const category = await Category.findByIdAndUpdate(id, updates, { new: true });

  if (!category) {
    throw new ExpressError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ExpressError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
