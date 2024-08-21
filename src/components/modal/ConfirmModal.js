import React from "react";
import ReactDOM from "react-dom";
import styles from "./ConfirmModal.module.css";
import Button from "../divers/Button";
import PropTypes from "prop-types";

const ConfirmModal = ({ isOpen, content, buttons, handleResponse, className }) => {
  if (!isOpen) return null;

  // Merge custom className with default styles
  const backdropClassName = `${styles.backdrop} ${className?.backdrop || ""}`;
  const modalContentClassName = `${styles.modalContent} ${className?.modalContent || ""}`;
  const buttonsContainerClassName = `${styles.buttonsContainer} ${className?.buttonsContainer || ""}`;

  return ReactDOM.createPortal(
    <div className={backdropClassName}>
      <div className={modalContentClassName}>
        {content}
        {buttons?.length ? (
          <div className={buttonsContainerClassName}>
            {buttons.map((item, i) => (
              <Button key={i} onClick={handleResponse.bind(this, item.value)}>
                {item.label}
              </Button>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>,
    document.body
  );
};

ConfirmModal.propTycpes = {
  isOpen: PropTypes.bool,
  content: PropTypes.node.isRequired,
  buttons: PropTypes.array,
  handleResponse: PropTypes.func,
  className: PropTypes.string,
};

ConfirmModal.defaultProps = {
  isOpen: true,
  buttons: [],
  handleResponse: () => {},
  className: null,
};

export default ConfirmModal;
