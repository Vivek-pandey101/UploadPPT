import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import styles from "./Login.module.css"; // Import CSS module
import { loginUser } from "../redux/loginAction";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleShow = () => setShow(!show);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required...");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success("Login successful! Redirecting...");
        const { email, name, isAdmin } = resultAction.payload;

        // Store user details in local storage
        localStorage.setItem(
          "userCred",
          JSON.stringify({ email, name, isAdmin })
        );

        setTimeout(() => {
          navigate(isAdmin ? "/admin-page" : "/");
        }, 2000);
      } else {
        toast.error(resultAction.payload || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.aboutGyankosha}>
        <p>
          <strong>Gyankosha</strong> – Transforming education with NEP-aligned
          excellence in academics, skills, and growth.
        </p>
        <p>
          Empowering students with 21st-century skills, mental agility, and
          holistic learning for a brighter future.
        </p>
      </div>
      <div className={styles.signupBox}>
        <h2 className={styles.heading}>Login</h2>
        <p className={styles.subtext}>
          A platform for diversified learning and inspiration
        </p>

        <div className={styles.inputGroup}>
          <label>
            Email <span>*</span>
          </label>
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
          <label>
            Password <span>*</span>
          </label>
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

        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
