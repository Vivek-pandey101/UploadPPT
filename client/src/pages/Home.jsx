import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImagesById } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../component/Loader";

const Home = () => {
  const { imageArr, isLoading } = useSelector((state) => state.images);

  // Get the logged-in teacher's email and name from localStorage
  const userDetails = JSON.parse(localStorage.getItem("userCred")) || {};
  const userEmail = userDetails?.email;

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (!userDetails.email) {
      navigate("/login");
    }
  }, [userDetails.email, navigate]);

  const handleShowSlides = (id) => {
    dispatch(fetchImagesById(id));
    localStorage.setItem("id", id)
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
        navigate("/login");
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

  // Filter PPTs for the logged-in teacher
  const filteredImageArr = imageArr.filter((item) =>
    item.enabledUser.includes(userEmail)
  );

  return (
    <div style={styles.homeContainer}>
      <div style={styles.header}>
        <h2 style={styles.welcomeText}>Welcome, {userDetails?.name}</h2>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div style={styles.content}>
        <h1 style={styles.homeTitle}>PPT Slide Presentations</h1>
        <p style={styles.homeDescription}>
          Click on a link to view the slides for each presentation.
        </p>
        <div style={styles.imageLinksContainer}>
          {filteredImageArr.length > 0 ? (
            filteredImageArr.map((item) => (
              <div key={item._id} style={styles.imageLinkCard}>
                <div style={styles.imageLink}>
                  <h2 style={styles.imageTitle}>{item.name}</h2>
                  <Link
                    to={`/images/${item._id}`}
                    onClick={() => handleShowSlides(item._id)}
                    style={styles.linkText}
                  >
                    See slide for this PPT
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noPptMessage}>No PPTs assigned to you.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f9f9f9",
    overflow: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#007bff",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  welcomeText: {
    margin: 0,
    fontSize: "1.5rem",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#cc0000",
    },
  },
  content: {
    flex: 1,
    padding: "20px",
    textAlign: "center",
    overflowY: "auto",
  },
  homeTitle: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "10px",
  },
  homeDescription: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "30px",
  },
  imageLinksContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "0 20px",
    margin: "0 auto"
  },
  imageLinkCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  imageLink: {
    display: "block",
    padding: "20px",
    textDecoration: "none",
    color: "inherit",
  },
  imageTitle: {
    fontSize: "1.5rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  linkText: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  noPptMessage: {
    fontSize: "1.2rem",
    color: "#666",
    marginTop: "20px",
  },
};

export default Home;
