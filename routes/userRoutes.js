const express = require ("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerUser);
router.get("/:email", userController.getUser);
router.put("/:email", userController.updateUser)

module.exports = router;