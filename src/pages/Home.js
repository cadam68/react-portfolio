import React, { useState } from "react";
import styles from "./Home.module.css";
import { FaArrowTrendUp } from "react-icons/fa6";
import PortfolioLink from "../components/inLine/PortfolioLink";
import SpinnerFullPage from "../components/divers/SpinnerFullPage";
import { useOutletContext } from "react-router-dom";
import { removeDiacritics } from "../services/Helper";

const Home = () => {
  const { portfolioList } = useOutletContext();

  const [inputValues, setInputValues] = useState({
    searchCriteria: "",
  });

  const handleInputChange = (e, regex) => {
    const { name, value } = e.target;
    let upperValue = value.toUpperCase();
    if (regex.test(upperValue)) {
      setInputValues({
        ...inputValues,
        [name]: upperValue,
      });
    }
  };

  if (!portfolioList) return <SpinnerFullPage />;

  return (
    <div className={"inline-section"}>
      <div className={"inline-banner"}>
        <img src="/images/BannerHome.jpg" alt="Home Banner" className={"bannerImage"} />
        <h1 className="slide-in">Welcome!</h1>
      </div>
      <div className={`inline-content ${styles.content}`}>
        <h2>
          Already {portfolioList.length} Portfolio On-Line <FaArrowTrendUp />
        </h2>
        <p>
          It's time to elevate your online presence and make your mark. Our platform gives you the power to build a portfolio that not only reflects your <em>true potential</em> but also highlights your unique strengths
          and vision. Stand out from the crowd with a personalized space where your work, story, and creativity take center stage. Whether you're just starting out or looking to refine your online image, our tools make
          it easy to showcase what makes you special. Tell your story in your own words, connect with the world on your terms, and unleash your creativity to start making waves today.
        </p>
        <div className={styles.portfolioList}>
          <p>
            Search For &nbsp;
            <input type="text" name="searchCriteria" placeholder="Name" value={inputValues.searchCriteria} size={21} maxLength={15} onChange={e => handleInputChange(e, /^[A-Z]*$/)} />
          </p>
          <p>
            {portfolioList
              .filter(item => removeDiacritics(item.name).toUpperCase().includes(inputValues.searchCriteria.toUpperCase()))
              .slice(0, 100)
              .map(item => (
                <PortfolioLink key={item.userid} data={item} />
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
