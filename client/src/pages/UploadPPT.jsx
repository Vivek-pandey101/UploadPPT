import { useState } from "react";
import axios from "axios";

export default function UploadPPT() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PPT file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");
      const response = await axios.post("http://localhost:3000/ppt/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Upload successful: " + response.data.message);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-xl font-bold">Upload PPT</h2>
      <input type="file" accept=".ppt,.pptx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
