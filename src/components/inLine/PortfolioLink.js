import React from "react";
import styles from "./PortfolioLink.module.css";

const displayPortfolio = (userid) => {
  window.open(`/portfolio/${userid}`, "_blank");
};

const PortfolioLink = ({ data: { userid, name, vip } }) => {
  return (
    <span onClick={() => displayPortfolio(userid)} className={styles.item + " " + (vip ? styles.vip : "")}>
      {name}
    </span>
  );
};

export default PortfolioLink;
