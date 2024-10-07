import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { Log } from "../services/LogService";
import { useToast } from "../contexts/ToastContext";
import styles from "./Portfolio.module.css";
import { Helmet } from "react-helmet";
import useComponentTranslation from "../hooks/useComponentTranslation";
import S from "string";
import UseLocalStorageState from "../hooks/UseLocalStorageState";
import { changePortfolioTheme, getFilteredLanguages, themes_portfolio } from "../services/Helper";
import PortfolioFooter from "../components/portfolio/PortfolioFooter";
import PortfolioHeader from "../components/portfolio/PortfolioHeader";
import { settings } from "../Settings";
import RenderContent from "../components/portfolio/RenderContent";

const logger = Log("Portfolio");

const Portfolio = () => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("Portfolio");
  const { userId, lg: param_lg, itemId: param_itemId } = useParams();

  const {
    portfolioService: { portfolio, setPortfolioId },
  } = useAppContext();
  const { Toast } = useToast();

  const [portfolioSettings, setPortfolioSettings] = UseLocalStorageState("portfolio-settings", { visited: [] });
  const [filteredLanguages, setFilteredLanguages] = useState({});
  const [selectedItem, setSelectedItem] = useState(null); // Single state for the selected item

  const initialState = { lg: null, itemId: null, items: null };
  const reducer = (state, { type, payload }) => {
    // console.log(`reducer type=${type} + state=${JSON.stringify(state)} + payload=${JSON.stringify(payload)}`);
    switch (type) {
      case "init": {
        let { param_lg, param_itemId } = payload;
        let lg = param_itemId ? param_lg : i18n.resolvedLanguage;
        let itemId = param_itemId ? param_itemId : param_lg;
        const uniqueIds = [...new Set(portfolio?.downloadUrls.map(item => item.id))];
        let items = uniqueIds.map(id => {
          const entries = portfolio?.downloadUrls.filter(item => item.id === id);
          // return entries.find((item) => item.lg === lg) || entries[0];
          let entry = entries.find(item => item.lg === lg) || entries[0];
          entry.label = i18n.t(`title_${entry.id}`, { lng: lg, defaultValue: S(entry.id.replace(/[^a-zA-Z0-9]/g, " ")).titleCase().s });
          return entry;
        });

        if (!portfolioSettings?.visited?.includes(userId)) itemId = "[firstTime]";
        if (!uniqueIds.includes(itemId) || !items.find(item => item.id === itemId && settings.renderItemsTypes.includes(item.type))) itemId = items.find(item => settings.renderItemsTypes.includes(item.type))?.id;
        return { ...initialState, lg, itemId, items };
      }

      default:
        throw new Error(`Unknown action ${type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setPortfolioId(userId);
  }, [userId]);

  useEffect(() => {
    if (!portfolio || !portfolio.downloadUrls || !portfolio.downloadUrls.length) {
      if (portfolio && !portfolio.downloadUrls) {
        navigate("/portfolio", { replace: true });
      }
      return;
    }
    dispatch({ type: "init", payload: { param_lg, param_itemId } });
    setFilteredLanguages(getFilteredLanguages(portfolio?.downloadReferences));
    changePortfolioTheme({
      colorTheme: portfolio?.palette?.colorTheme || themes_portfolio.default.colorTheme,
      colorThemeStrong: portfolio?.palette?.colorThemeStrong || themes_portfolio.default.colorThemeStrong,
      colorBackground: portfolio?.palette?.colorBackground || themes_portfolio.default.colorBackground,
      colorHeaderBackground: portfolio?.palette?.colorHeaderBackground || themes_portfolio.default.colorHeaderBackground,
    });
  }, [portfolio, param_lg, param_itemId]);

  useEffect(() => {
    if (!state.lg) return;
    i18n.changeLanguage(state.lg);
  }, [state.lg]);

  useEffect(() => {
    if (!state.items) return;
    const selectedItem = state.items.find(item => item.id === state.itemId);
    setSelectedItem(selectedItem);
  }, [state.itemId, state.lg]);

  useEffect(() => {
    if (!state.lg) return;
    navigate(`/portfolio/${userId}/${i18n.resolvedLanguage}/${param_itemId ? param_itemId : state.itemId}`, { replace: true });
  }, [i18n.resolvedLanguage]);

  if (!state.items || !selectedItem) return null;
  if (!portfolioSettings?.visited?.includes(userId)) setPortfolioSettings({ ...portfolioSettings, visited: [...portfolioSettings.visited, userId] });

  return (
    <div className={styles.portfolio}>
      <Helmet>
        <title>{portfolio.name} Portfolio</title>
        <meta name="description" content={`Learn more about ${portfolio.name}`} />
        <meta name="keywords" content={`${portfolio.name}, ${portfolio.subTitle}`} />
      </Helmet>
      <div className={styles.wrapper}>
        <PortfolioHeader portfolio={portfolio} state={state} filteredLanguages={filteredLanguages} />
        <div className={styles.container}>
          <RenderContent item={selectedItem} style={portfolio.style} />
        </div>
        <PortfolioFooter portfolio={portfolio} />
      </div>
    </div>
  );
};

export default Portfolio;
