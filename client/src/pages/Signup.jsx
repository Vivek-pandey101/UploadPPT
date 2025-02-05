import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "../component/utils";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { registerUser } from "../redux/loginAction";

const Signup = ({ handleShowRegisterForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
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
    if (!validateInputs()) {
      return;
    }
    try {
      const resultAction = await dispatch(
        registerUser({ name, email, password })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Registration successful!");
      } else {
        toast.error(resultAction.payload || "Registration failed!");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className={styles.overlay} onClick={handleShowRegisterForm}>
      <div
        className={styles.signupWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.signupBox}>
          <h2>Register a user</h2>
          <div className={styles.inputField}>
            <label htmlFor="name">
              Name <span>*</span>
            </label>
            <div className={styles.nameInput}>
              <span>
                <FaUser />
              </span>
              <input
                type="text"
                id="name"
                placeholder="Enter name here"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.inputField}>
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <div className={styles.emailInput}>
              <span>
                <FaUser />
              </span>
              <input
                type="text"
                id="email"
                placeholder="Enter email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">
              Password <span>*</span>
            </label>
            <div className={styles.passwordInput}>
              <span>
                <FaLock />
              </span>
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Enter password here"
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
          <div className={styles.buttonContainer}>
            <button onClick={register} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </div>
        <ToastContainer />
        <button className={styles.close} onClick={handleShowRegisterForm}>
          <ImCross />
        </button>
      </div>
    </div>
  );
};

export default Signup;
