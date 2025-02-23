const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/categoryController");
const { categorySchema, partialCategorySchema } = require("../schemas/categorySchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(categorySchema), wrapAsync(createCategory));
router.get("/", wrapAsync(getAllCategories));
router.get("/:id", wrapAsync(getCategoryById));
router.put("/:id", validateSchema(partialCategorySchema), wrapAsync(updateCategoryById));
router.delete("/:id", wrapAsync(deleteCategoryById));

module.exports = router;
