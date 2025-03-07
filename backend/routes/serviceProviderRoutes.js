const express = require("express");
const {
  createServiceProvider,
  getAllServiceProviders,
  getServiceProviderById,
  updateServiceProviderById,
  deleteServiceProviderById,
  getServiceProviderDashboard,
} = require("../controllers/serviceProviderController");
const { serviceProviderSchema, partialServiceProviderSchema } = require("../schemas/serviceProviderSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(serviceProviderSchema), wrapAsync(createServiceProvider));
router.get("/:id", wrapAsync(getServiceProviderById));
router.get("/", wrapAsync(getAllServiceProviders));
router.put("/:id", validateSchema(partialServiceProviderSchema), wrapAsync(updateServiceProviderById));
router.delete("/:id", wrapAsync(deleteServiceProviderById));
router.get("/dashboard/:id", wrapAsync(getServiceProviderDashboard));

module.exports = router;
