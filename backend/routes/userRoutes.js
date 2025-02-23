const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controllers/userController");
const { userSchema, partialUserSchema } = require("../schemas/userSchema");
const validateSchema = require("../middlewares/validateSchema");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

// Define routes with validation middleware
router.post("/", validateSchema(userSchema), wrapAsync(createUser));
router.get("/", wrapAsync(getAllUsers));
router.get("/:id", wrapAsync(getUserById));
router.put("/:id", validateSchema(partialUserSchema), wrapAsync(updateUserById));
router.delete("/:id", wrapAsync(deleteUserById));

module.exports = router;
