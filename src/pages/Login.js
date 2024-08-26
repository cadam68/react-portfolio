import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./../contexts/AuthContext";
import { FaLock, FaUser, FaUserCircle } from "react-icons/fa";

const Login = () => {
  const [credentials, setCredentials] = useState({ userid: "", password: "" });
  const [error, setError] = useState();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e, regex) => {
    const { name, value } = e.target;
    if (regex.test(value)) {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    const success = await login(credentials.userid, credentials.password);

    if (success) {
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else navigate(-1);
    } else {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={"inline-section"}>
      <hr />
      <div className={"inline-content"}>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <div className={styles.icon}>
              <FaUserCircle size={80} />
            </div>
            <form onSubmit={handleLogin}>
              <div className={styles.inputContainer}>
                <FaUser className={styles.inputIcon} />
                <input type="text" name="userid" value={credentials.userid} onChange={e => handleInputChange(e, /[^\s<>]+$/)} placeholder="Username" required />
              </div>
              <div className={styles.inputContainer}>
                <FaLock className={styles.inputIcon} />
                <input type="password" name="password" value={credentials.password} onChange={e => handleInputChange(e, /.*/)} placeholder="Password" required />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" className={styles.loginButton}>
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
