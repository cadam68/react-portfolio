import { useLocation, useNavigate } from "react-router-dom";
import Hover from "../divers/Hover";
import Button from "../divers/Button";
import { useDebugContext } from "../../contexts/DebugContext";
import useComponentTranslation from "../../hooks/useComponentTranslation";
import { useAppContext } from "../../contexts/AppContext";
import { getFilteredLanguages } from "../../services/Helper";

const PortfolioHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { admin } = useDebugContext();
  const { i18n, t } = useComponentTranslation("Logo");
  const {
    portfolioService: { portfolio },
  } = useAppContext();

  const filteredLanguages = getFilteredLanguages(portfolio?.downloadReferences);

  return (
    <header className={"portfolio-header"}>
      <div>
        <h2>{portfolio?.title}</h2>
        <h6>{portfolio?.subTitle}</h6>
      </div>

      <div className={"floatingBanner"}>
        {Object.keys(filteredLanguages)?.length > 1 ? (
          <Hover caption={t("caption_changeLanguage")}>
            <Button
              className={`button-shadow button-big`}
              onClick={() => {
                const availableLanguages = Object.keys(filteredLanguages);
                const i = (availableLanguages.indexOf(i18n.resolvedLanguage) + 1) % availableLanguages.length;
                i18n.changeLanguage(availableLanguages[i]);
              }}
            >
              {filteredLanguages[i18n.resolvedLanguage]}
            </Button>
          </Hover>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default PortfolioHeader;
