import React, { useEffect, useRef, useState } from "react";
import styles from "./PortfolioCreation.module.css";
import FileSelector from "../components/divers/FileSelector";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { removeDiacritics } from "../services/Helper";
import { FetchService } from "../services/FetchService";
import { useAuthContext } from "../contexts/AuthContext";
import { Log } from "../services/LogService";
// import { useWebSocket } from "./../contexts/WebSocketContext";

const logger = Log("PortfolioCreation");
const portfolioTemplate = {
  welcomeCardPortfolio: {
    name: "Portfolio with Welcome Card",
    fields: ["username", "email", "welcomeText", "userImage", "additionalImages"],
  },
  videoLinkPortfolio: {
    name: "Portfolio with Video Link",
    fields: ["username", "videoLink"],
  },
  cvPortfolio: {
    name: "Portfolio with Welcome Card and CV",
    fields: ["username", "email", "welcomeText", "userImage", "cv"],
  },
};

const PortfolioCreation = () => {
  const userImageRef = useRef(null);
  const additionalImagesRef = useRef(null);
  const cvRef = useRef(null);
  const { portfolioList } = useOutletContext();
  const location = useLocation();
  const [formData, setFormData] = useState({
    portfolioType: Object.keys(portfolioTemplate)[0],
    username: "",
    email: "",
    welcomeText: "",
    userImage: null,
    additionalImages: [],
    videoLink: "",
    cv: null,
  });
  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const {
    confirmService: { requestConfirm },
  } = useAppContext();
  const { Toast } = useToast();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  // const { sendMessage } = useWebSocket();

  useEffect(() => {
    if (location.state) setFormData({ ...formData, username: location.state.portfolioName || "" });
  }, [location.state]);

  const clearForm = e => {
    e?.preventDefault();
    setErrors({});
    setFormData({ portfolioType: formData.portfolioType, username: "", email: "", welcomeText: "", userImage: null, additionalImages: [], videoLink: "", cv: null });
    userImageRef.current?.clear();
    additionalImagesRef.current?.clear();
    cvRef.current?.clear();
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (file, startsWith, fieldName) => {
    if (!file) return;
    if (file.type.startsWith(startsWith)) {
      setFormData({ ...formData, [fieldName]: file });
      setErrors({ ...errors, [fieldName]: "" });
    } else {
      setErrors({ ...errors, [fieldName]: "Please select a valid file type" });
    }
  };

  const handleAdditionalFileSelect = file => {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      if (formData.additionalImages.length < 6) {
        setFormData({
          ...formData,
          additionalImages: [...formData.additionalImages, file],
        });
        setErrors({ ...errors, additionalImages: "" });
      } else {
        setErrors({ ...errors, additionalImages: "You can only upload up to 6 images" });
      }
    } else {
      setErrors({ ...errors, additionalImages: "Please select a valid image file" });
    }
  };

  const removeImage = index => {
    const updatedImages = formData.additionalImages.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalImages: updatedImages });
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const ComponentPortfolioCreated = (userid, username) => (
    <span>
      Portfolio of{" "}
      <a href={`/portfolio/${userid}`} target="_blank">
        {username}
      </a>{" "}
      successfully created!
    </span>
  );

  const handleSubmit = async e => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};

    try {
      // This bug is on purpose
      setFormData({ ...formData, username: formData.username?.trim(), welcomeText: formData.welcomeText?.trim() });

      logger.debug("validation of the user input");
      if (portfolioTemplate[formData.portfolioType].fields.includes("username") && !formData.username) {
        valid = false;
        newErrors.username = "Username is required";
      }
      if (portfolioTemplate[formData.portfolioType].fields.includes("email") && (!formData.email || !validateEmail(formData.email))) {
        valid = false;
        newErrors.email = "Please enter a valid email";
      }
      if (portfolioTemplate[formData.portfolioType].fields.includes("welcomeText") && !formData.welcomeText) {
        valid = false;
        newErrors.welcomeText = "Welcome Text is required";
      }
      if (portfolioTemplate[formData.portfolioType].fields.includes("userImage") && !formData.userImage) {
        valid = false;
        newErrors.userImage = "Please select a user image";
      }
      if (portfolioTemplate[formData.portfolioType].fields.includes("videoLink") && !formData.videoLink) {
        valid = false;
        newErrors.videoLink = "Please select the url of the video";
      }
      if (portfolioTemplate[formData.portfolioType].fields.includes("cv") && !formData.cv) {
        valid = false;
        newErrors.cv = "Please select a document";
      }

      setErrors(newErrors);
      logger.debug(`user inputs are ${valid ? "" : "not"} valid`);

      if (valid) {
        if (!(await requestConfirm(<span>Please Confirm the creation of the portfolio</span>))) return;

        logger.debug(`generate userid based on username=[${formData.username}]`);
        let userid = removeDiacritics(formData.username)
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "");

        // Format the name, this bug is on purpose, exception throw if empty
        let username = formData.username.trim();
        username = username
          .split(" ")
          .map(item => item[0].toUpperCase() + item.slice(1).toLowerCase())
          .join(" ");

        logger.debug("submit the formData");
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("portfolioType", formData.portfolioType);
        formDataToSubmit.append("userid", userid);
        if (portfolioTemplate[formData.portfolioType].fields.includes("username")) formDataToSubmit.append("username", username);
        if (portfolioTemplate[formData.portfolioType].fields.includes("email")) formDataToSubmit.append("email", formData.email);
        if (portfolioTemplate[formData.portfolioType].fields.includes("welcomeText")) formDataToSubmit.append("welcomeText", formData.welcomeText);
        if (portfolioTemplate[formData.portfolioType].fields.includes("userImage")) formDataToSubmit.append("userImage", formData.userImage);
        if (portfolioTemplate[formData.portfolioType].fields.includes("additionalImages")) formData.additionalImages.forEach((image, index) => formDataToSubmit.append(`additionalImage_${index + 1}`, image));
        if (portfolioTemplate[formData.portfolioType].fields.includes("videoLink")) formDataToSubmit.append("videoLink", formData.videoLink);
        if (portfolioTemplate[formData.portfolioType].fields.includes("cv")) formDataToSubmit.append("cv", formData.cv);

        let data;
        try {
          setSubmit(true);
          data = await FetchService().createPortfolioBundle(formDataToSubmit);
          if (!data) throw new Error("Sorry, the portfolio can not be created...");
          if (data?.errors?.length) throw new Error(data.errors[0].errorMsg);
          if (data.message) Toast.info(data.message);
        } catch (error) {
          if (error.message == "SESSION_EXPIRED") {
            Toast.error("Session Timeout!");
            if (user) logout();
            navigate("/login");
          } else {
            Toast.error(error.message);
            setErrors({ submit: error.message });
          }
          setSubmit(false);
          return;
        }
        logger.debug("The formData has successfully submitted");
        await requestConfirm(ComponentPortfolioCreated(data.userid, formData.username), [{ label: "Close", value: true }]);
        setSubmit(false);
        setErrors({ ...errors, submit: "" });
        Toast.info(`Portfolio of ${formData.username} created with id ${data.userid}`);
        clearForm();
      }
    } catch (err) {
      logger.fatal(err.message);
    }
  };

  return (
    <div className="inline-section">
      <hr />
      <div className={"inline-content " + styles.portfolioCreationContainer}>
        <form onSubmit={handleSubmit} className={styles.portfolioForm + " inline-form"} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <select disabled={submit} className={styles.h3} name="portfolioType" value={formData.portfolioType} onChange={handleInputChange}>
              {Object.keys(portfolioTemplate).map(key => (
                <option key={key} value={key}>
                  {"Create " + portfolioTemplate[key].name}
                </option>
              ))}
            </select>
          </div>

          {portfolioTemplate[formData.portfolioType].fields.includes("username") && (
            <div className={styles.formGroup}>
              <label>User Name</label>
              <input disabled={submit} type="text" name="username" value={formData.username} onChange={handleInputChange} className={errors.username ? styles.inputError : ""} />
              <p className={styles.errorText}>{errors.username}&nbsp;</p>
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("email") && (
            <div className={styles.formGroup}>
              <label>Email</label>
              <input disabled={submit} type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? styles.inputError : ""} />
              <p className={styles.errorText}>{errors.email}&nbsp;</p>
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("welcomeText") && (
            <div className={styles.formGroup}>
              <label>Welcome Text</label>
              <textarea disabled={submit} name="welcomeText" value={formData.welcomeText} onChange={handleInputChange} className={errors.welcomeText ? styles.inputError : ""} />
              <p className={styles.errorText}>{errors.welcomeText}&nbsp;</p>
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("videoLink") && (
            <div className={styles.formGroup}>
              <label>Video Link</label>
              <input disabled={submit} type="url" name="videoLink" value={formData.videoLink} onChange={handleInputChange} className={errors.videoLink ? styles.inputError : ""} />
              <p className={styles.errorText}>{errors.videoLink}&nbsp;</p>
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("userImage") && (
            <div className={styles.formGroup}>
              <p className={styles.errorText}>{errors.userImage}&nbsp;</p>
              <span style={{ display: "inline-block" }} className={errors.userImage ? styles.inputError : ""}>
                <FileSelector ref={userImageRef} disabled={submit || formData.userImage} documentAllowedExtensions={["jpg", "png"]} documentMaxSize={200} onFileSelect={file => handleFileSelect(file, "image/", "userImage")} showSelectedFile={false} buttonText={"Select User Image"} />
              </span>
              {formData.userImage && (
                <div className={styles.imagePreview}>
                  <span>{formData.userImage.name}</span>
                  <button
                    disabled={submit}
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => {
                      setFormData({ ...formData, userImage: null });
                    }}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("additionalImages") && (
            <div className={styles.formGroup}>
              <p className={styles.errorText}>{errors.additionalImages}&nbsp;</p>
              <FileSelector ref={additionalImagesRef} disabled={submit || formData.additionalImages?.length >= 5} documentAllowedExtensions={["jpg", "png"]} documentMaxSize={200} onFileSelect={handleAdditionalFileSelect} showSelectedFile={false} buttonText={"Select Portfolio Image(s)"} />
              <div className={styles.imagePreviewList}>
                {formData.additionalImages.map((image, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <span>{image.name}</span>
                    <button disabled={submit} type="button" onClick={() => removeImage(index)} className={styles.removeBtn}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portfolioTemplate[formData.portfolioType].fields.includes("cv") && (
            <div className={styles.formGroup}>
              <p className={styles.errorText}>{errors.cv}&nbsp;</p>
              <span style={{ display: "inline-block" }} className={errors.cv ? styles.inputError : ""}>
                <FileSelector ref={cvRef} disabled={submit || formData.cv} documentAllowedExtensions={["pdf"]} documentMaxSize={400} onFileSelect={file => handleFileSelect(file, "application/pdf", "cv")} showSelectedFile={false} buttonText={"Select CV Document"} />
              </span>
              {formData.cv && (
                <div className={styles.imagePreview}>
                  <span>{formData.cv.name}</span>
                  <button
                    disabled={submit}
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => {
                      setFormData({ ...formData, cv: null });
                    }}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          <p className={styles.errorText}>{errors.submit}&nbsp;</p>
          <div className={"submit " + styles.formGroup}>
            <button disabled={submit} onClick={clearForm}>
              Clear Form
            </button>
            <button disabled={submit} type="submit">
              Create Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioCreation;
