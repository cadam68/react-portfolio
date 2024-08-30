import React, { memo, useEffect, useState } from "react";
import styles from "./InLine.module.css";
import { Helmet } from "react-helmet";
import Header from "../components/inLine/Header";
import Footer from "../components/inLine/Footer";
import { Outlet } from "react-router-dom";
import { changeTheme, sortAndLimitPortfolioItems, themes } from "../services/Helper";
import { FetchService } from "../services/FetchService";
import "../inline.css";

const InLine = () => {
  const [portfolioList, setPortfolioList] = useState();

  const links = [
    { name: "Home", link: "/home" },
    { name: "About Us", link: "/aboutUs" },
    { name: "Contact Us", link: "/contactUs" },
    { name: "Admin", link: "/admin", accessRoles: ["admin"] },
  ];

  const fetchPortfolio = async controller => {
    const signal = controller.signal;
    try {
      const data = await FetchService().fetchPortfolioList(false, signal);
      setPortfolioList(sortAndLimitPortfolioItems(data));
    } catch (err) {
      if (err.name === "AbortError") console.log("fetch portfolio aborted!");
      else console.log(err.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isFetching = true;

    fetchPortfolio(controller).finally(() => {
      isFetching = false;
    });

    // Cleanup function to abort fetch when `query` changes
    return () => {
      if (isFetching) controller.abort();
    };
  }, []);

  useEffect(() => {
    changeTheme({
      colorLightest: themes.light.colorLightest,
      colorLight: themes.light.colorLight,
      colorMedium: themes.light.colorMedium,
      colorDark: themes.light.colorDark,
      colorBackground: themes.light.colorBackground,
      fontFamily: themes.light.fontFamily,
    });
  }, []);

  return (
    <>
      <Header links={links} />
      <section className={styles.largeContainer}>
        <Helmet>
          <title>In-Line Portfolio</title>
          <meta name="description" content="In-Line is a dynamic and innovative company dedicated to providing high-quality and cutting-edge technology products to our valued customers across the globe." />
          <meta name="keywords" content="Innovative technology, Customer-focused, High-quality products, Global tech solutions" />
        </Helmet>
        <Outlet context={{ portfolioList }} />
      </section>
      <Footer links={links} />
    </>
  );
};

export default memo(InLine);
