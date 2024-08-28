// src/components/Header.js

import React, { useEffect } from "react";
import styles from "./Header.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Hover from "../divers/Hover";

const Header = ({ links }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/home", { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.jpg" alt="In-Line Logo" />
        In-Line
      </div>
      <nav className={styles.nav}>
        <ul>
          {links.map(item => {
            const hasAccess = !item.accessRoles || (item?.accessRoles && user?.role && item.accessRoles.some(role => user.role.toUpperCase().includes(role.toUpperCase())));
            if (hasAccess)
              return (
                <li key={item.link}>
                  <NavLink to={item.link}>{item.name}</NavLink>
                </li>
              );
          })}
          {user ? (
            <li>
              <Hover visible={true} caption={`${user.name} currently logged`}>
                <a onClick={logoutHandler}>Logout</a>
              </Hover>
            </li>
          ) : (
            <li>
              <NavLink to={"/login"}>Login</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
