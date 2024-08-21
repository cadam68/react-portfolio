// src/components/ContactDetail.js

import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./ContactDetail.module.css";

const ContactDetail = ({ type, info }) => {
  let IconComponent;

  switch (type) {
    case "phone":
      IconComponent = FaPhone;
      break;
    case "email":
      IconComponent = FaEnvelope;
      break;
    case "address":
      IconComponent = FaMapMarkerAlt;
      break;
    default:
      IconComponent = null;
  }

  return (
    <div className={styles.contactDetail}>
      <div className={styles.icon}>
        <IconComponent />
      </div>
      <div className={styles.text}>
        <p className={styles.title}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p className={styles.info}>{info}</p>
      </div>
    </div>
  );
};

export default ContactDetail;
