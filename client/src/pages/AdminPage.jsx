import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";
import GalleryPage from "./GalleryPage";
import Loader from "../component/Loader";
import Signup from "./Signup";
import axios from "axios";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [name, setName] = useState("");
  const [pptFile, setPptFile] = useState(null);
  const [password, setPassword] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const { imageArr, isLoading } = useSelector((state) => state.images);
  const userDetails = JSON.parse(localStorage.getItem("userCred")) || {};

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [navigate, userDetails]);

  const handleShowRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const onNameChange = (e) => {
    setName(e.target.value); // Update the name field
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Set selected files
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the files.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Please select images.");
      return;
    }
    if (selectedFiles.length > 10) {
      alert("You can upload a maximum of 10 files at once.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Only JPEG, PNG, and GIF files are allowed.");
        return;
      }
    }

    // Dispatch uploadImages action
    dispatch(uploadImages({ name, selectedFiles }));
    setSelectedFiles([]); // Clear selected files
    setName(""); // Clear the name field
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      const response = await fetch("http://localhost:3000/register/logout", {
        method: "POST",
        credentials: "include", // Include cookies for session-based logout
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("userCred");
        navigate("/login"); // Redirect to the login page
      } else {
        console.error("Failed to logout");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleConvertAndUpload = async () => {
    if (!name.trim()) {
      alert("Please enter a name for the files.");
      return;
    }
    if (!pptFile) {
      alert("Please select a PPT file.");
      return;
    }

    setIsConverting(true);
    const formData = new FormData();
    formData.append("File", pptFile);
    formData.append("Timeout", "900");
    formData.append("StoreFile", "false");
    formData.append("FileName", pptFile.name);
    formData.append("Password", password);
    formData.append("PageRange", "1-2000");
    formData.append("ConvertHiddenSlides", "false");
    formData.append("JpgType", "jpeg");
    formData.append("ImageQuality", "75");
    formData.append("ImageResolutionH", "200");
    formData.append("ImageResolutionV", "200");
    formData.append("ScaleImage", "false");
    formData.append("ScaleProportions", "true");
    formData.append("ScaleIfLarger", "false");
    formData.append("TextAntialiasing", "1");
    formData.append("GraphicsAntialiasing", "1");
    formData.append("ImageInterpolation", "false");
    formData.append("UseCIEColor", "false");

    try {
      const response = await axios.post(
        "https://v2.convertapi.com/convert/ppt/to/jpg?Secret=secret_MNYdGimnEi3Rri4r",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const convertedFiles = await Promise.all(
        response.data.Files.map(async (file, index) => {
          const blob = base64ToBlob(file.FileData, "image/jpeg");
          return new File([blob], `${name}_page_${index + 1}.jpg`, {
            type: "image/jpeg",
          });
        })
      );

      dispatch(uploadImages({ name, selectedFiles: convertedFiles }));
      setPptFile(null);
      setPassword("");
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error converting PPT file. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArrays], { type: mimeType });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Admin Page</h1>
          <div className={styles.logoutButton}>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleShowRegisterForm}>Register a user</button>
            <Link to={"/teaching-progress"}>Teaching Progress</Link>
          </div>
        </div>

        {/* Existing Image Upload Form */}
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Enter file name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
          <input
            type="file"
            accept=".ppt,.pptx"
            onChange={(e) => setPptFile(e.target.files[0])}
            className={styles.input}
          />
          <button
            className={styles.button}
            onClick={handleConvertAndUpload}
            disabled={isConverting || isLoading}
          >
            {isConverting ? "Converting..." : "Convert & Upload PPT"}
          </button>
        </div>

        <GalleryPage images={imageArr} />
      </div>
      {showRegisterForm && (
        <Signup handleShowRegisterForm={handleShowRegisterForm} />
      )}
    </>
  );
};

export default AdminPage;
