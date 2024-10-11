import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./../contexts/AuthContext";
import { FaLock, FaUser, FaUserCircle } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { useAppContext } from "../contexts/AppContext";
import { FetchService } from "../services/FetchService";
import { settings } from "../Settings";

const Login = () => {
  const [credentials, setCredentials] = useState({ userid: "", password: "", email: "" });
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [error, setError] = useState();
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    confirmService: { requestConfirm },
  } = useAppContext();

  const handleInputChange = (e, regex) => {
    const { name, value } = e.target;
    if (regex.test(value)) {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    }
  };

  const switchForm = () => {
    setRecoverPassword(prevState => !prevState);
    setError();
  };

  const handleLogin = async e => {
    e.preventDefault();

    if (!recoverPassword) {
      try {
        await login(credentials.userid, credentials.password);
        const from = location.state?.from?.pathname;
        if (from) navigate(from, { replace: true });
        else navigate(-1);
      } catch (e) {
        setError(e.message);
      }
    } else {
      try {
        await FetchService().recoverPassword(credentials.userid, credentials.email);
        await requestConfirm(<span>Please check your mailbox for your credential information</span>, [{ label: "Close", value: true }]);
        setCredentials({ ...credentials, password: "", email: "" });
        setRecoverPassword(false);
      } catch (e) {
        setError(e.message);
      }
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
              {!recoverPassword && (
                <div className={styles.inputContainer}>
                  <FaLock className={styles.inputIcon} />
                  <input type="password" name="password" value={credentials.password} onChange={e => handleInputChange(e, /.*/)} placeholder="Password" required />
                </div>
              )}
              {recoverPassword && (
                <div className={styles.inputContainer}>
                  <IoMail className={styles.inputIcon} />
                  <input type="email" name="email" value={credentials.email} onChange={e => handleInputChange(e, /.*/)} placeholder="Email" required />
                </div>
              )}
              {error && <p className={styles.errMessage}>{error}</p>}
              <button type="submit" className={styles.loginButton}>
                {!recoverPassword ? "LOGIN" : "RECOVER PASSWORD"}
              </button>
              {false && (
                <span className={styles.link} onClick={switchForm}>
                  {recoverPassword ? "Login Form" : "Recover Password"}
                </span>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
