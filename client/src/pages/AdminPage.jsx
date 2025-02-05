import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";
import GalleryPage from "./GalleryPage";
import Loader from "../component/Loader";
import Signup from "./Signup";
import JSZip from "jszip";
import axios from "axios";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [name, setName] = useState("");
  const [pptFile, setPptFile] = useState(null);
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

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/register/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("userCred");
        navigate("/login");
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
    formData.append("documents", pptFile, pptFile.name);

    try {
      const response = await axios.post(
        "https://api.slidize.cloud/v1.0/slides/convert/png",
        formData,
        {
          responseType: "blob",
        }
      );

      const zip = await JSZip.loadAsync(response.data);
      const convertedFiles = await Promise.all(
        Object.values(zip.files).map(async (file, index) => {
          if (!file.dir && /\.(png|jpe?g)$/i.test(file.name)) {
            const imageBlob = await file.async("blob");
            return new File([imageBlob], `${name}_page_${index + 1}.png`, {
              type: "image/png",
            });
          }
          return null;
        })
      );

      dispatch(
        uploadImages({ name, selectedFiles: convertedFiles.filter(Boolean) })
      );
      setPptFile(null);
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error converting PPT file. Please try again.");
    } finally {
      setIsConverting(false);
    }
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
