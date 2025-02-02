import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleError } from "../component/utils";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);

  const handleShow = () => {
    setShow(!show);
  };

  const navigate = useNavigate();

  const validateInputs = () => {
    if (!name || !email || !password) {
      handleError("All fields are required!");
      return false;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      handleError("Please enter a valid email address.");
      return false;
    }

    // Password validation
    if (password.length < 4) {
      handleError("Password must be at least 4 characters long.");
      return false;
    }

    return true;
  };

  const register = async () => {
    // console.log(loginInfo);
    if (!validateInputs()) {
      return;
    }
    try {
      const url = "http://localhost:3000/register/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.status === 400) {
        toast.error("Email already exists...");
        return;
      }
      const result = await response.json();
      console.log(result);
      navigate("/login");
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div className={styles.SignupContainer}>
      <div className={styles.Signup}>
        <h2>Register</h2>
        <div className={styles.name}>
          <label htmlFor="name">
            Name <span>*</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.email}>
          <label htmlFor="email">
            Email <span>*</span>
          </label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">
            Password <span>*</span>
          </label>
          <div className={styles.passwordInput}>
            <input
              type={show ? "text" : "password"}
              id="password"
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {show ? (
              <button onClick={handleShow}>
                  <FaEye />
              </button>
            ) : (
                <button onClick={handleShow}>
                    <FaEyeSlash />
              </button>
            )}
          </div>
        </div>
        <div className={styles.register}>
          <button onClick={register} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className={styles.error}>{error}</p>}
          <span>
            Already have an account? <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
