import React, { useState } from "react";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../component/utils";
import { ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => {
    setShow(!show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      handleError("All fields are required...");
      return;
    }
    try {
      const url = "http://localhost:3000/register/login";
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const result = await response.json();
        // console.log(result); // Log the result to see if `isAdmin` is true
        const { email, name, isAdmin } = result;
        localStorage.setItem("userCred", JSON.stringify({ email, name, isAdmin }));
        if (isAdmin) {
          console.log("Navigating to admin page...");
          navigate("/admin-page");
          return
        }else if (!isAdmin) {
          console.log("Navigating to home page...");
          navigate("/");
          return
        }
      } else {
        handleError("Email or password is wrong");
        return;
      }
    } catch (error) {
      handleError(error.message);
      return;
    }
  };
  

  return (
    <div className={styles.SignupContainer}>
      <div className={styles.Signup}>
        <h2>Login</h2>
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
          <Link>Lost your password? </Link>

          <button onClick={handleLogin}>Login</button>
          <span>
            Don't have an account? <Link to={"/signup"}>Signup</Link>
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
