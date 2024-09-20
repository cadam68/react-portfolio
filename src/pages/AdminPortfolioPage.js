import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Log } from "../services/LogService";
import { useAppContext } from "../contexts/AppContext";
import { FetchService } from "../services/FetchService";
import { useToast } from "../contexts/ToastContext";
import { settings } from "../Settings";
import styles from "./AdminPortfolioPage.module.css";
import { copyToClipboard, validateSchema } from "../services/Helper";
import { useAuthContext } from "../contexts/AuthContext";

const logger = Log("AdminPortfolio");

const AdminPortfolioPage = () => {
  const { portfolioList } = useOutletContext();
  const { userId } = useParams();
  const [userName, setUserName] = useState();
  const [documentList, setDocumentList] = useState([]);
  const [refreshDocumentList, setRefreshDocumentList] = useState(true);
  const [inputValues, setInputValues] = useState({ jsonData: "" });
  const [errorProfile, setErrorProfile] = useState("");
  const [errorUpload, setErrorUpload] = useState("");
  const [errorDelete, setErrorDelete] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [canBeDeleted, setCanBeDeleted] = useState(false);
  const fileInputRef = useRef(null);
  const {
    confirmService: { requestConfirm },
  } = useAppContext();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { Toast } = useToast();

  // load portfolio
  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchPortfolio = async id => {
      try {
        logger.info(`loading portfolio for userId ${id}`);
        const urlProfile = await FetchService().getDownloadUrl(`${id}.profile.json`, id, abortCtrl);
        if (!urlProfile) throw new Error(`Portfolio for userId ${id} not available`);
        const portfolioData = await FetchService().getDownloadJson(urlProfile, abortCtrl);
        setInputValues({ jsonData: JSON.stringify(portfolioData, null, 2) });
      } catch (e) {
        if (e.message) logger.error(e.message);
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
      const userData = portfolioList?.find(item => item.userid === userId);
      setUserName(userData?.name);
      setCanBeDeleted(userData?.privilege ? !userData.privilege.includes("VIP") : true);
      logger.info(`fetch portfolio(portfolioId=[${userId}])...`);
      fetchPortfolio(userId);
    }

    return () => {
      abortCtrl.abort();
    };
  }, [userId, navigate, requestConfirm]);

  useEffect(() => {
    const abortCtrl = new AbortController();

    const fetchPortfolioDocumentList = async id => {
      try {
        logger.info(`loading portfolioDocumentList for userId ${id}`);
        const data = await FetchService().getPortfolioDocumentList(id, abortCtrl);
        setDocumentList(data);
        setRefreshDocumentList(false);
      } catch (_) {}
    };

    if (userId && refreshDocumentList) fetchPortfolioDocumentList(userId);

    return () => {
      abortCtrl.abort();
    };
  }, [userId, refreshDocumentList]);

  const handleInputChange = (e, regex = /.*/) => {
    if (!hasChanged) setHasChanged(true);
    const { name, value } = e.target;
    if (regex.test(value)) {
      setInputValues({
        ...inputValues,
        [name]: value,
      });
    } else {
      setErrorProfile(`Invalid input for ${name}`);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const updatedJson = JSON.parse(inputValues.jsonData);
      validateSchema(updatedJson);
      const jsonData = JSON.stringify(updatedJson, null, 2);
      const res = await FetchService().savePortfolio(userId, jsonData);
      if (!res) throw new Error(`Invalid profile`);

      setInputValues({ jsonData: jsonData });
      setErrorProfile("");
      setHasChanged(false);
      Toast.info(`Portfolio for userid ${userId} saved`);
    } catch (e) {
      setErrorProfile(e.message || "Invalid profile format");
    }
  };

  const handleFileChange = event => {
    const file = event.target.files[0];

    if (file) {
      const isValidFileType = settings.documentAllowedExtensions.some(fileExtension => file.name.endsWith(fileExtension));
      if (file.size > settings.documentMaxSize) {
        setErrorUpload(`File size exceeds the maximum limit of ${settings.documentMaxSize / (1024 * 1024)} MB`);
        setSelectedFile(null);
      } else if (!isValidFileType) {
        setErrorUpload(`Invalid file type. Only ${settings.documentAllowedExtensions.join(", ")} documents are allowed`);
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setErrorUpload("");
      }
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setErrorUpload("Please select a valid file first");
      return;
    }

    try {
      const data = await FetchService().uploadPortfolioDocument(selectedFile, userId);
      if (!data) throw new Error("Sorry, the file can not be uploaded...");

      if (data.message) Toast.info(data.message);
      setErrorUpload("");
      setSelectedFile(null);
      setRefreshDocumentList(true);
    } catch (error) {
      setErrorUpload(error.message);
    }
  };

  const handleDeletePortfolio = async () => {
    if (
      !(await requestConfirm(
        <div className="inline-popup">
          Do you want to <em>delete the Portfolio of {userName} and all related documents</em> ?
        </div>
      ))
    ) {
      return;
    }
    //
    try {
      const data = await FetchService().deletePortfolio(userId);
      if (!data) throw new Error("Sorry, the portfolio can not be deleted...");
      if (data?.error) throw new Error(data.error);
      if (data.message) Toast.info(data.message);

      await requestConfirm(
        <div className="inline-popup">
          Portfolio of <em>{userName}</em> was successfully deleted
        </div>,
        [{ label: "Close", value: true }]
      );
      navigate(-1);
    } catch (error) {
      if (error.message == "SESSION_EXPIRED") {
        Toast.error("Session Timeout!");
        if (user) logout();
        navigate("/login");
      } else {
        Toast.error(error.message);
        setErrorDelete(error.message);
      }
    }
  };

  // security again direct access
  if (!userId || !userName) return null;

  return (
    <div className="inline-section">
      <hr />
      <div className="inline-content">
        <div className={styles.adminPortfolio}>
          <div>{userName} Portfolio Profile</div>
          <div>
            <p className={styles.error}>{errorProfile}&nbsp;</p>
            <form className="inline-form" onSubmit={handleSubmit}>
              <textarea style={{ width: "100%", height: "400px" }} name="jsonData" value={inputValues.jsonData} onBlur={() => setErrorProfile("")} onChange={e => handleInputChange(e, /.*/)} />
              <button type="submit" disabled={!!errorProfile || !inputValues.jsonData || !hasChanged}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <div className="inline-content">
        <div className={styles.adminPortfolio}>
          <div>{userName} Portfolio Document(s)</div>
          <div>
            <p className={styles.error}>{errorUpload}&nbsp;</p>
            <div className="inline-form">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={handleFileUpload} disabled={!selectedFile}>
                  Upload File
                </button>
                <button type="button" onClick={handleSelectFile}>
                  Select a File
                </button>
                <span className="input">{selectedFile?.name || "No file selected"}</span>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            </div>
            <div>
              {documentList?.length > 0 && (
                <ul className={styles.documentList}>
                  {documentList.map(item => (
                    <li
                      key={item.id}
                      onClick={async () => {
                        if (await copyToClipboard(item.url)) Toast.info(`The url of the ${item.name.split("/").pop()} file is copied in the Clipboard`);
                      }}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {canBeDeleted && (
        <>
          <hr />
          <div className={styles.adminPortfolio + " inline-content inline-form"}>
            <div className={"warning"}>
              <div className={styles.error}>{errorDelete}&nbsp;</div>
              <button onClick={handleDeletePortfolio} type="button">
                {`Delete ${userName} Portfolio`.toUpperCase()}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPortfolioPage;
