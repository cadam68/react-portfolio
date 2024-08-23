import React from "react";
import "./Modal.css";
import Button from "./../divers/Button";
import PropTypes from "prop-types";

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <div className={"center"}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

Modal.defaultProps = {};

export default Modal;
