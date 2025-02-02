const express = require("express");
const {
  uploadToAws,
  fetchImages,
  fetchImageById,
  updateBoolean,
  addEnabledUsers,
} = require("../controllers/upload");

// Router setup
const router = express.Router();
router.patch("/:id/updateBoolean", updateBoolean);
router.post("/upload", uploadToAws);
router.get("/fetchall", fetchImages);
router.get("/fetchall/:id", fetchImageById);
router.put("/files/:fileId/enableUser", addEnabledUsers);

module.exports = router;
