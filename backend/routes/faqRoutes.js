const express = require("express");
const {
  createFAQ,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
} = require("../controllers/faqController");
const { faqSchema, partialFAQSchema } = require("../schemas/faqSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(faqSchema), wrapAsync(createFAQ));
router.get("/", wrapAsync(getAllFAQs));
router.get("/:id", wrapAsync(getFAQById));
router.put("/:id", validateSchema(partialFAQSchema), wrapAsync(updateFAQById));
router.delete("/:id", wrapAsync(deleteFAQById));

module.exports = router;
