import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { settings } from "../Settings";
import useConfirm from "../hooks/useConfirm";
import styles from "../App.module.css";
import { Log } from "../services/LogService";
import { FetchService } from "../services/FetchService";
import useComponentTranslation from "../hooks/useComponentTranslation";

const logger = Log("AppContext");

const AppContext = createContext({
  confirmService: { requestConfirm: () => {}, ConfirmModalComponent: () => {} },
  basicDataService: { basicData: undefined },
  isLoading: true,
  isReady: true,
  portfolioService: {
    portfolio: undefined,
    portfolioId: undefined,
    setPortfolioId: () => {},
  },
});

const currentDate = new Date();

// => used to convert JSON dates
// /!\ dates are converted to strings because JSON doesn't have a native date type. //!\
const converter = (rawValues) => {
  // *** exemple of implementation ***
  // rawValues?.data.forEach((item) => {
  //   if (item.date && !isNaN(Date.parse(item.date))) item.date = startOfDay(new Date(item.date));
  // });
  return rawValues;
};

const fetchAllDownloadUrls = async (downloadReferences, pid, abortCtrl) => {
  const firebaseBaseUrl = "firebase://";
  const values = await Promise.all(
    downloadReferences
      .filter((item) => settings.downloadTypes.includes(item.type))
      .map(async (item) => {
        try {
          let downloadUrl = item.target;
          let data;
          if (item.target.startsWith(firebaseBaseUrl)) {
            downloadUrl = await FetchService().fetchDownloadUrl(item.target.substring(firebaseBaseUrl.length), pid, abortCtrl);
            if (!downloadUrl) return undefined;

            if (["carousel"].includes(item.type)) {
              data = await FetchService().fetchDownloadJson(downloadUrl, abortCtrl);
              if (!data) return undefined;
            }
          }
          return { ...item, url: downloadUrl, data };
        } catch (err) {
          logger.error(`Error fetching download url for file : ${item.fileName}`);
        }
      })
  );
  return values.filter((item) => item != undefined);
};


const AppContextProvider = ({ children }) => {
  const { i18n } = useComponentTranslation();
  const { requestConfirm, ConfirmModalComponent } = useConfirm(styles);
  const [basicData, setBasicData] = useState();
  const [portfolio, setPortfolio] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [portfolioId, setPortfolioId] = useState();

  // load basicData(s)
  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchBasicData = async () => {
      let data = {};
      setIsLoading(true);
      // data = await fetchBasicData(settings.basicDataReferences, abortCtrl); // example of implementation
      logger.debug(`initialise basicData : ${JSON.stringify(data)}`);
      setBasicData(data);
      setIsLoading(false);
      setIsReady(true);
    };

    fetchBasicData();

    return () => {
      abortCtrl.abort();
    };
  }, []);

  // load portfolio
  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchPortfolio = async (pid) => {
      setIsLoading(true);
      try {
        logger.info(`loading portfolio for userId ${pid}`);
        let urlProfile = await FetchService().fetchDownloadUrl(`${pid}.profile.json`, pid, abortCtrl);
        logger.info("urlProfile", urlProfile);
        let portfolioData = await FetchService().fetchDownloadJson(urlProfile, abortCtrl);
        let downloadUrls = await fetchAllDownloadUrls(portfolioData.downloadReferences, pid, abortCtrl);
        portfolioData.downloadUrls = downloadUrls;
        setPortfolio(portfolioData);
      } catch (e) {
        // console.log(e);
        setPortfolio({}); // if(empty) will be redirected to HomePage
      }
      setIsLoading(false);
    };

    if (!portfolioId) return;
    logger.debug(`fetch portfolio(portfolioId=[${portfolioId}])...`);
    fetchPortfolio(portfolioId);

    return () => {
      abortCtrl.abort();
    };
  }, [portfolioId]);


  const contextValues = useMemo(
    () => ({
      confirmService: { requestConfirm, ConfirmModalComponent },
      basicDataService: { basicData },
      isLoading,
      isReady,
      portfolioService: { portfolio, portfolioId, setPortfolioId },
    }),
    [ConfirmModalComponent, basicData, isLoading, isReady, portfolioId, portfolio]
  ); // value is cached by useMemo

  return <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

export { AppContextProvider, useAppContext };
