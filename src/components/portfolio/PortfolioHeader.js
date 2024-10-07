import React from "react";
import Button from "../divers/Button";
import styles from "./PortfolioHeader.module.css";
import { FetchService } from "../../services/FetchService";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import useComponentTranslation from "../../hooks/useComponentTranslation";
import { settings } from "../../Settings";

const PortfolioHeader = ({ portfolio, state, filteredLanguages }) => {
  const navigate = useNavigate();
  const { i18n, t } = useComponentTranslation("Portfolio");
  const { Toast } = useToast();
  const { userId } = useParams();

  const downloadFileHandler = async (fileUrl, fileName) => {
    try {
      await FetchService().getDownloadFile(fileUrl, fileName);
      Toast.info(`The file ${fileName} is downloaded`);
    } catch (error) {
      Toast.error(`The file ${fileName} is not available yet!`);
    }
  };

  const displayLogo = label => {
    if (!label) return;
    const title = label.toUpperCase();
    return (
      <div className={styles.logo}>
        <span>{title[0]}</span> {title.slice(1)}
      </div>
    );
  };

  const displayLinks = () => {
    const links = state.items.filter(item => item.type && !/^\[.*\]$/.test(item.id));
    if (links.length > 1) {
      return links.map(item => (
        <li key={item.id}>
          <a
            className={`${state.itemId === item.id ? "disabled" : ""}`}
            onClick={() => {
              if (settings.renderItemsTypes.includes(item.type)) {
                navigate(`/portfolio/${userId}/${state.lg}/${item.id}`, { replace: true });
              } else if (item.type === "file") {
                downloadFileHandler(item.url, item.target.split("/").pop());
              } else if (item.type === "url") {
                window.open(item.url, "_blank", "noopener,noreferrer");
              } else if (item.type === "mailto") {
                window.location.href = item.url;
              }
            }}>
            {item.label}
          </a>
        </li>
      ));
    }
  };

  const displayLanguage = () => {
    return (
      Object.keys(filteredLanguages)?.length > 1 && (
        <Button
          className={`button-shadow button-big`}
          onClick={() => {
            const availableLanguages = Object.keys(filteredLanguages);
            const i = (availableLanguages.indexOf(state.lg) + 1) % availableLanguages.length;
            i18n.changeLanguage(availableLanguages[i]);
          }}>
          {filteredLanguages[state.lg]}
        </Button>
      )
    );
  };

  return (
    <header className={styles.header}>
      {displayLogo(portfolio?.title)}
      <nav>
        <ul>
          {displayLinks()}
          <li key={"lg"}>{displayLanguage()}</li>
        </ul>
      </nav>
    </header>
  );
};

export default PortfolioHeader;
