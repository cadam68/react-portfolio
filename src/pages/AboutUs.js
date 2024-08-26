import React from "react";
import styles from "./AboutUs.module.css";
import { FaRegEye, FaArrowsToCircle } from "react-icons/fa6";

const AboutUs = () => {
  return (
    <div className={"inline-section"}>
      <div className={"inline-banner"}>
        <img src="/images/BannerAboutUs.jpg" alt="About Us Banner" className={"bannerImage"} />
        <h1 className="slide-in">About Us</h1>
      </div>
      <div className={"inline-content"}>
        <h2>Who We Are</h2>
        <p>
          We are a dynamic startup focused on empowering individuals to create and customize their own <em>portfolio</em> web pages. Our platform allows users to showcase their work, share their stories, and connect with
          a global audience. Whether you are an artist, developer, writer, or professional, our service is designed to help you build an online presence effortlessly.
        </p>
        <div className={styles.missionVision}>
          <div className={styles.mission}>
            <FaArrowsToCircle className={"icon"} />
            <h2>Our Mission</h2>
            <p>
              Our mission is to democratize the ability to create personalized portfolio websites, making it accessible to <em>everyone</em>. We aim to provide a user-friendly platform where users can add videos, text,
              documents, links, and carousels, all without needing any technical skills. By offering our service for free, we encourage creativity and self-expression across all fields.
            </p>
          </div>
          <div className={styles.vision}>
            <FaRegEye className={"icon"} />
            <h2>Our Vision</h2>
            <p>
              We envision a world where everyone has the opportunity to present their work online, regardless of their background or technical expertise. Our platform aspires to be the go-to solution for creating
              customizable and professional portfolios that reflect the unique personality and achievements of each user.
            </p>
          </div>
        </div>
        <h2>Why Choose Us</h2>
        <p>
          Our platform is designed with simplicity and flexibility in mind, allowing users to effortlessly create and manage their portfolios. We offer a range of customizable
          <em> features</em> that cater to different needs and styles. With our commitment to innovation and customer satisfaction, we provide a seamless experience that empowers everyone to showcase their talents and
          accomplishments on their terms.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
