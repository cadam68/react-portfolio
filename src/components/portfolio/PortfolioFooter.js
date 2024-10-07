import React from "react";
import styles from "./PortfolioFooter.module.css"; // Use appropriate CSS for styling

const PortfolioFooter = ({ portfolio }) => {
  return (
    <footer className={styles.footer}>
      <p>
        &copy; {new Date().getFullYear()} {portfolio?.name} Portfolio. All Rights Reserved.
      </p>
    </footer>
  );
};

export default PortfolioFooter;
