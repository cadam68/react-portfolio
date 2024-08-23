import React from "react";
import styles from "./PortfolioLink.module.css";

const displayPortfolio = (userid) => {
  window.open(`/portfolio/${userid}`, "_blank");
};

const PortfolioLink = ({ data: { userid, name, role } }) => {
  return (
    <span onClick={() => displayPortfolio(userid)} className={styles.item + " " + (role.includes("VIP") ? styles.vip : "")}>
      {name}
    </span>
  );
};

export default PortfolioLink;
