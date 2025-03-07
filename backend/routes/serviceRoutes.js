const express = require("express");
const {
  createService,
  getAllServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  searchServices,
  getTopRatedServices,
  getLatestServices,
  getServicesByProviderId // New function to fetch services by provider ID
} = require("../controllers/serviceController");
const { serviceSchema, partialServiceSchema } = require("../schemas/serviceSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");
const upload = require("../middlewares/multer"); // Import multer middleware

const router = express.Router();

// Routes with validation middleware 
router.post("/", 
  upload.array("images", 5),  // Allow multiple images (max 5)
  validateSchema(serviceSchema), 
  wrapAsync(createService)
);

router.put("/:id", 
  upload.array("images", 5),  // Allow updating images
  validateSchema(partialServiceSchema), 
  wrapAsync(updateServiceById)
);

router.get("/search", wrapAsync(searchServices));
router.get("/latest", wrapAsync(getLatestServices)); // Get latest services
router.get("/top-rated", wrapAsync(getTopRatedServices)); // Get top-rated services
router.get("/provider/:providerId", wrapAsync(getServicesByProviderId)); // New route to get services by provider ID
router.get("/", wrapAsync(getAllServices));
router.get("/:id", wrapAsync(getServiceById));
router.delete("/:id", wrapAsync(deleteServiceById));

module.exports = router;
