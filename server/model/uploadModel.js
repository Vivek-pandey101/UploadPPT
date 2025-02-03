const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: String, // Store the name of the upload
    url: [
      { link: { type: String }, isChecked: [{ type: String }] },
    ], // Store the URLs of uploaded files
    enabledUser: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
