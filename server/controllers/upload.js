const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const File = require("../model/uploadModel");
require("dotenv").config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

// S3 client configuration
const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: REGION,
});

// Multer configuration for S3
const uploadWithMulter = () =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, { fieldname: file.fieldname });
      },
      key: function (req, file, cb) {
        // Ensure a unique file key (add timestamp or random string to prevent collisions)
        const timestamp = Date.now();
        const fileExtension = file.originalname.split(".").pop();
        const fileName = `${timestamp}_${file.originalname}`;
        cb(null, fileName); // Creates a unique file key
      },
    }),
  }).array("s3Images", 10);

// Upload files to S3 and save metadata in MongoDB
const uploadToAws = (req, res) => {
  const upload = uploadWithMulter();
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: err, message: "Error occurred while uploading" });
    }

    const urls = req.files.map((file) => ({
      link: file.location,
      is
    }));
    const name = req.body.name; // Get the name field from the frontend

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    try {
      // Find the existing document or create a new one if it doesn't exist
      let fileDoc = await File.findOne({ name: name });

      if (fileDoc) {
        // Append the new URLs to the existing `url` array
        fileDoc.url.push(...urls);
        await fileDoc.save();
      } else {
        // Create a new document with the `name` and URLs
        fileDoc = new File({ name, url: urls });
        await fileDoc.save();
      }

      res.status(200).json({
        message: "Files uploaded successfully",
        document: fileDoc,
      });
    } catch (error) {
      console.error("Error saving metadata to MongoDB", error);
      res.status(500).json({
        error: error.message,
        message: "Error saving metadata to MongoDB",
      });
    }
  });
};

// Fetch metadata from MongoDB and send it to the frontend
const fetchImages = async (req, res) => {
  try {
    // Fetch all documents or a specific one based on name (if required)
    const fileDocs = await File.find();

    if (!fileDocs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No images found" });
    }

    res.status(200).json({ success: true, images: fileDocs });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: err.message,
    });
  }
};

const fetchImageById = async (req, res) => {
  const { id } = req.params; // Get the image ID from the URL parameter

  try {
    // Find the document by the provided ID
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    res.status(200).json({ success: true, image: fileDoc });
  } catch (err) {
    console.error("Error fetching image by ID:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching image",
      error: err.message,
    });
  }
};

const updateBoolean = async (req, res) => {
  const { id, urlLink, isCheckedForEmail } = req.body;

  try {
    const fileDoc = await File.findById(id);

    if (!fileDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const urlIndex = fileDoc.url.findIndex((u) => u.link === urlLink);

    if (urlIndex === -1) {
      return res.status(404).json({ message: "URL not found in the document" });
    }

    // Initialize isChecked array if it doesn't exist
    if (!Array.isArray(fileDoc.url[urlIndex].isChecked)) {
      fileDoc.url[urlIndex].isChecked = [];
    }

    // console.log("isCheckedForEmail : ", isCheckedForEmail);

    if (!fileDoc.url[urlIndex].isChecked.includes(isCheckedForEmail)) {
      fileDoc.url[urlIndex].isChecked.push(isCheckedForEmail);
    }else{
      fileDoc.url[urlIndex].isChecked.pop(isCheckedForEmail);
    }

    fileDoc.markModified("url");
    await fileDoc.save();

    res.status(200).json({ success: true, document: fileDoc });
    // console.log(fileDoc);
  } catch (err) {
    console.error("Error updating boolean value:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Example route in your backend (e.g., in Express)
const addEnabledUsers = async (req, res) => {
  const { fileId } = req.params; // Expects a single fileId
  const { email, enable } = req.body;

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (enable) {
      // Add user email to enabledUser array if not already present
      if (!file.enabledUser.includes(email)) {
        file.enabledUser.push(email);
      }
    } else {
      // Remove user email from enabledUser array
      file.enabledUser = file.enabledUser.filter(
        (userEmail) => userEmail !== email
      );
    }

    await file.save();
    res
      .status(200)
      .json({ message: "User enabled/disabled successfully", file });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { uploadToAws, fetchImages, fetchImageById, updateBoolean, addEnabledUsers };
