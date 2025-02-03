import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../component/utils";
import { ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import styles from "./Login.module.css"; // Import CSS module

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => setShow(!show);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      handleError("All fields are required...");
      return;
    }
    try {
      const url = "https://uploadppt.onrender.com/register/login";
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        const { email, name, isAdmin } = result;
        localStorage.setItem("userCred", JSON.stringify({ email, name, isAdmin }));
        navigate(isAdmin ? "/admin-page" : "/");
      } else {
        handleError("Email or password is wrong");
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h2 className={styles.heading}>Login</h2>
        <p className={styles.subtext}>A platform for diversified learning and inspiration</p>

        <div className={styles.inputGroup}>
          <label>Email <span>*</span></label>
          <div className={styles.inputField}>
            <FaUser className={styles.inputIcon} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Password <span>*</span></label>
          <div className={styles.inputField}>
            <FaLock className={styles.inputIcon} />
            <input
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.showPasswordBtn} onClick={handleShow}>
              {show ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        {/* <div className={styles.forgotPassword}>
          <Link to="/forgot-password">Lost your password?</Link>
        </div> */}
        <button className={styles.loginBtn} onClick={handleLogin}>Login</button>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
