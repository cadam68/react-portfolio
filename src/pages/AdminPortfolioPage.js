import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Log } from "../services/LogService";
import { useAppContext } from "../contexts/AppContext";
import { FetchService } from "../services/FetchService";
import { useToast } from "../contexts/ToastContext";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = Log("AdminPortfolio");

const AdminPortfolioPage = () => {
  const { userId } = useParams();
  const [inputValues, setInputValues] = useState({ jsonData: "" });
  const [error, setError] = useState("");
  const {
    confirmService: { requestConfirm },
  } = useAppContext();
  const navigate = useNavigate();
  const { Toast } = useToast();

  const schemas = {
    profile: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        userId: { type: "string", pattern: "^[a-zA-Z0-9_-]+$" },
        name: { type: "string", minLength: 1 },
        email: { type: ["string", "null"], format: "email" },
        title: { type: "string", minLength: 1 },
        subTitle: { type: ["string", "null"], minLength: 1 },
        downloadReferences: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", pattern: "^[\\w\\[\\]-]+$" },
              lg: { type: ["string", "null"], enum: ["en", "fr", "de", null] },
              type: { type: "string", enum: ["card", "video", "carousel", "file", "url"] },
              target: { type: "string", pattern: "^(firebase:\\/\\/.+\\.(card|mp4|json|pdf)|https?:\\/\\/\\S+)$" },
            },
            required: ["id", "type", "target"],
            additionalProperties: false,
          },
        },
        palette: {
          type: ["object", "null"],
          properties: {
            colorLightest: { type: "string" },
            colorLight: { type: "string" },
            colorMedium: { type: "string" },
            colorDark: { type: "string" },
            colorBackground: { type: "string" },
            fontFamily: { type: "string" },
          },
          required: ["colorLightest", "colorLight", "colorMedium", "colorDark", "colorBackground"],
          additionalProperties: false,
        },
      },
      required: ["userId", "name", "email", "title", "subTitle", "downloadReferences"],
      additionalProperties: false,
    },
  };

  // load portfolio
  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchPortfolio = async id => {
      try {
        logger.info(`loading portfolio for userId ${id}`);
        const urlProfile = await FetchService().fetchDownloadUrl(`${id}.profile.json`, id, abortCtrl);
        if (!urlProfile) throw new Error(`Portfolio for userId ${id} not available`);
        logger.info("urlProfile", urlProfile);
        const portfolioData = await FetchService().fetchDownloadJson(urlProfile, abortCtrl);
        setInputValues({ jsonData: JSON.stringify(portfolioData, null, 2) });
      } catch (e) {
        console.error(e);
        await requestConfirm(
          <div className="inline-popup">
            <div>
              Portfolio for userid <em>{id}</em> not available!
            </div>
          </div>,
          [{ label: "Close", value: true }]
        );
        navigate(-1);
      }
    };

    if (userId) {
      logger.info(`fetch portfolio(portfolioId=[${userId}])...`);
      fetchPortfolio(userId);
    }

    return () => {
      abortCtrl.abort();
    };
  }, [userId, navigate, requestConfirm]);

  const handleInputChange = (e, regex = /.*/) => {
    const { name, value } = e.target;
    if (regex.test(value)) {
      setInputValues({
        ...inputValues,
        [name]: value,
      });
    } else {
      setError(`Invalid input for ${name}`);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const updatedJson = JSON.parse(inputValues.jsonData);
      const validate = ajv.compile(schemas.profile);
      const valid = validate(updatedJson);
      if (!valid) {
        const errorString = validate.errors.map(err => `${err.instancePath} ${err.message}`).join("; ");
        throw new Error(`Invalid profile schema: ${errorString}`);
      }

      setInputValues({ jsonData: JSON.stringify(updatedJson, null, 2) });
      setError("");
      Toast.info(`Portfolio for userid ${userId} saved`);
    } catch (e) {
      setError(e.message || "Invalid profile format");
    }
  };

  if (!userId) return null;

  return (
    <div className="inline-section">
      <hr />
      <div className="inline-content">
        <div>
          <div>Update {userId} Portfolio</div>
          <div>
            {<p style={{ color: "red", fontSize: "12px", margin: "0" }}>{error}&nbsp;</p>}
            <form onSubmit={handleSubmit}>
              <textarea style={{ width: "100%", height: "400px" }} name="jsonData" value={inputValues.jsonData} onBlur={() => setError("")} onChange={e => handleInputChange(e, /.*/)} />
              <button type="submit" disabled={!!error || !inputValues.jsonData}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolioPage;
