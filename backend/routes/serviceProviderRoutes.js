const express = require("express");
const {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProviderById,
  deleteServiceProviderById,
} = require("../controllers/serviceProviderController");
const { serviceProviderSchema, partialServiceProviderSchema } = require("../schemas/serviceProviderSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(serviceProviderSchema), wrapAsync(createServiceProvider));
router.get("/", wrapAsync(getAllServiceProviders));
router.get("/:id", wrapAsync(getServiceProviderById));
router.put("/:id", validateSchema(partialServiceProviderSchema), wrapAsync(updateServiceProviderById));
router.delete("/:id", wrapAsync(deleteServiceProviderById));

module.exports = router;
