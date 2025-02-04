import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImages, fetchImages } from "../redux/action";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./AdminPage.module.css";
import GalleryPage from "./GalleryPage";
import Loader from "../component/Loader";
import Signup from "./Signup";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleShowRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [name, setName] = useState("");

  const { imageArr, isLoading } = useSelector((state) => state.images);
  const userDetails = JSON.parse(localStorage.getItem("userCred")) || {};

  useEffect(() => {
    if (!userDetails) {
      navigate("login");
    }
  }, []);

  const onNameChange = (e) => {
    setName(e.target.value); // Update the name field
  };

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files); // Set selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    dispatch(fetchImages()); // Fetch the updated image list after upload
    setSelectedFiles([]); // Clear selected files
    setName(""); // Clear the name field
  };

  useEffect(() => {
    const getUserList = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/register/getAllUsers"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to fetch users. Please try again later.");
      }
    };
    getUserList();
  }, [navigate]); // Dependency array includes navigate

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
          </div>
        </div>
        <form method="post" onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Enter file name"
            value={name}
            onChange={onNameChange}
            className={styles.input}
          />
          <input
            type="file"
            onChange={onImageChange}
            accept="image/*"
            multiple
            className={styles.input}
          />
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? <div className={styles.spinner}></div> : "Upload"}
          </button>
        </form>
        <GalleryPage images={imageArr} />
        <div className={styles.teachinProgress}>
          <Link to={"/teaching-progress"}>Teaching Progress</Link>
        </div>
      </div>
      {showRegisterForm && (
        <Signup handleShowRegisterForm={handleShowRegisterForm} />
      )}
    </>
  );
};

export default AdminPage;
