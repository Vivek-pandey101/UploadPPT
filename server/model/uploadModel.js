const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: String, // Store the name of the upload
    url: [{ link: { type: String }, isChecked: [{ type: String }] }], // Store the URLs of uploaded files
    timeStamp: [
      {
        email: { type: String },
        userName: { type: String },
        clickedIndex: { type: Number },
        actionTimestamp: { type: String },
        docName: { type: String },
      },
    ],
    enabledUser: [{ type: String }],
    timeSpent: [
      {
        email: String,
        slideIndex: Number,
        duration: Number, // milliseconds
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
