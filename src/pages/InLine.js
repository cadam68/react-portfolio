import React, { memo, useEffect, useState } from "react";
import styles from "./InLine.module.css";
import { Helmet } from "react-helmet";
import Header from "../components/inLine/Header";
import Footer from "../components/inLine/Footer";
import { Outlet } from "react-router-dom";
import { changeTheme, sortAndLimitPortfolioItems, themes } from "../services/Helper";
import { FetchService } from "../services/FetchService";
import "../inline.css";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";

const logger = Log("InLine");

const InLine = () => {
  const [portfolioList, setPortfolioList] = useState();
  const {
    webSocketService: { portfolioEvent },
  } = useAppContext();

  const links = [
    { name: "Home", link: "/home" },
    { name: "About Us", link: "/aboutUs" },
    { name: "Contact Us", link: "/contactUs" },
    { name: "Admin", link: "/admin", accessRoles: ["portfolio_admin"] },
  ];

  const fetchPortfolio = async controller => {
    const signal = controller.signal;
    try {
      const data = await FetchService().getPortfolioList(false, signal);
      setPortfolioList(sortAndLimitPortfolioItems(data));
    } catch (err) {
      if (err.name === "AbortError") logger.debug("fetch portfolio aborted!");
      else logger.error(err.message);
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

  const updatePortfolioList = value => {
    let { action, data } = value;
    switch (action) {
      case "add":
        {
          let { userid, name } = data;
          if (userid && name) {
            logger.debug(`update portfolioList, add new userid=[${userid}], name=[${name}]`);
            setPortfolioList(previousState => [...previousState, { userid, name, privilege: null }]);
          }
        }
        break;
      case "del": {
        let { userid } = data;
        if (userid) {
          logger.debug(`update portfolioList, delete userid=[${userid}]`);
          setPortfolioList(previousState => previousState.filter(item => item.userid !== userid));
        }
      }
    }
  };

  useEffect(() => {
    if (!portfolioEvent?.action || !portfolioEvent?.data) return;
    logger.debug(`Execute ${portfolioEvent.action} with ${JSON.stringify(portfolioEvent.data)} ...`);
    updatePortfolioList(portfolioEvent);
  }, [portfolioEvent]);

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
