// src/components/Header.js

import React from "react";
import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.jpg" alt="In-Line Logo" />
        In-Line
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <NavLink to={"/home"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/aboutUs"}>About Us</NavLink>
          </li>
          <li>
            <NavLink to={"/contactUs"}>Contact Us</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
