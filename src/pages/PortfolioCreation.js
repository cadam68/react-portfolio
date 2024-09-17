import React, { useEffect, useState } from "react";
import styles from "./PortfolioCreation.module.css";
import FileSelector from "../components/divers/FileSelector";
import { useAppContext } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { removeDiacritics } from "../services/Helper";
import { FetchService } from "../services/FetchService";
import { useAuthContext } from "../contexts/AuthContext";

const PortfolioCreation = () => {
  const { portfolioList, updatePortfolioList } = useOutletContext();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    welcomeText: "",
    userImage: null,
    additionalImages: [],
  });
  const [errors, setErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const {
    confirmService: { requestConfirm },
  } = useAppContext();
  const { Toast } = useToast();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) setFormData({ ...formData, username: location.state.portfolioName || "" });
  }, [location.state]);

  const clearForm = e => {
    e?.preventDefault();
    setErrors({});
    setFormData({ username: "", email: "", welcomeText: "", userImage: null, additionalImages: [] });
  };

  const handleInputChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = file => {
    if (!file) return;
    if (file.type.startsWith("image/")) {
      setFormData({ ...formData, userImage: file });
      setErrors({ ...errors, userImage: "" });
    } else {
      setErrors({ ...errors, userImage: "Please select a valid image file" });
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

  const handleSubmit = async e => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};

    if (!formData.username) {
      valid = false;
      newErrors.username = "Username is required";
    }
    if (!formData.email || !validateEmail(formData.email)) {
      valid = false;
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.welcomeText) {
      valid = false;
      newErrors.welcomeText = "Welcome Text is required";
    }
    if (!formData.userImage) {
      valid = false;
      newErrors.userImage = "Please select a user image";
    }
    setErrors(newErrors);

    if (valid) {
      setSubmit(true);
      if (!(await requestConfirm(<span>Please Confirm the creation of the portfolio</span>))) return;

      let userid = removeDiacritics(formData.username)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "");

      const formDataToSubmit = new FormData();
      formDataToSubmit.append("userid", userid);
      formDataToSubmit.append("username", formData.username);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("welcomeText", formData.welcomeText);
      formDataToSubmit.append("userImage", formData.userImage);
      formData.additionalImages.forEach((image, index) => formDataToSubmit.append(`additionalImage_${index + 1}`, image));

      let data;
      try {
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

      updatePortfolioList({ action: "add", data: { userid: data.userid, name: data.name } });
      await requestConfirm(
        <span>
          Portfolio of{" "}
          <a href={`/portfolio/${data.userid}`} target="_blank">
            {formData.username}
          </a>{" "}
          succeed!
        </span>,
        [{ label: "Close", value: true }]
      );

      setSubmit(false);
      setErrors({ ...errors, submit: "" });
      Toast.info(`Portfolio of ${formData.username} created with id ${data.userid}`);
      clearForm();
    }
  };

  return (
    <div className="inline-section">
      <hr />
      <div className={"inline-content " + styles.portfolioCreationContainer}>
        <h3>Create New Portfolio</h3>
        <form onSubmit={handleSubmit} className={styles.portfolioForm + " inline-form"} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label>User Name</label>
            <input disabled={submit} type="text" name="username" value={formData.username} onChange={handleInputChange} className={errors.username ? styles.inputError : ""} />
            <p className={styles.errorText}>{errors.username}&nbsp;</p>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input disabled={submit} type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? styles.inputError : ""} />
            <p className={styles.errorText}>{errors.email}&nbsp;</p>
          </div>

          <div className={styles.formGroup}>
            <label>Welcome Text</label>
            <textarea disabled={submit} name="welcomeText" value={formData.welcomeText} onChange={handleInputChange} className={errors.welcomeText ? styles.inputError : ""} />
            <p className={styles.errorText}>{errors.welcomeText}&nbsp;</p>
          </div>

          <div className={styles.formGroup}>
            <p className={styles.errorText}>{errors.userImage}</p>
            <span style={{ display: "inline-block" }} className={errors.userImage ? styles.inputError : ""}>
              <FileSelector
                disabled={submit || formData.userImage}
                documentAllowedExtensions={["jpg", "png"]}
                documentMaxSize={200}
                onFileSelect={handleFileSelect}
                showSelectedFile={false}
                buttonText={"Select User Image"}
              />
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

          <div className={styles.formGroup}>
            <p className={styles.errorText}>{errors.additionalImages}</p>
            <FileSelector
              disabled={submit || formData.additionalImages?.length >= 5}
              documentAllowedExtensions={["jpg", "png"]}
              documentMaxSize={200}
              onFileSelect={handleAdditionalFileSelect}
              showSelectedFile={false}
              buttonText={"Select Portfolio Image(s)"}
            />
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
