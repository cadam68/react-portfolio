
import React from "react";
import styles from "./ContactUs.module.css";
import ContactDetail from "../components/inLine/ContactDetail";

const ContactUs = () => {
  return (
    <div className={styles.contactUs}>
      <div className={styles.banner}>
        <img src="/images/BannerContactUs.jpg" alt="About Us Banner" className={styles.bannerImage} />
        <h1 className="slide-in">Contact Us</h1>
      </div>
      <div className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <h2>Lets connect to get more offer</h2>
          <p>
            Join <em>In-Line</em> today and unlock exclusive offers and deals. We are here to help you with any information you need about our services and solutions.
          </p>
          <div className={styles.contactDetails}>
            <ContactDetail type="phone" info="+33 (0)6 51 72 23 39" />
            <ContactDetail type="email" info="info@in-line.fr" />
            <ContactDetail type="address" info="19A rue Rogg Haas, Sierentz, France" />
          </div>
        </div>
        <div className={styles.contactMap}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43001.92179893415!2d7.443024290339176!3d47.652948591786334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479197d902dfa607%3A0xccf826b31c92af97!2s68510%20Sierentz!5e0!3m2!1sfr!2sfr!4v1723798565855!5m2!1sfr!2sfr"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "6px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
