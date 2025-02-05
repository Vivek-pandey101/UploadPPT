const express = require("express");
const {
  uploadToAws,
  fetchImages,
  fetchImageById,
  updateBoolean,
  addEnabledUsers,
  deleteDocument,
  trackTimeSpent,
} = require("../controllers/upload");

// Router setup
const router = express.Router();
router.patch("/:id/updateBoolean", updateBoolean);
router.post("/upload", uploadToAws);
router.get("/fetchall", fetchImages);
router.get("/fetchall/:id", fetchImageById);
router.put("/files/:fileId/enableUser", addEnabledUsers);
router.delete("/delete/:id", deleteDocument);
router.post('/track-time', trackTimeSpent);

module.exports = router;
