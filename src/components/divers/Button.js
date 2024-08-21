import PropTypes from "prop-types";
import { memo, useState } from "react";

const Button = ({ className, type, onClick, children, secured = false, disabled = false }) => {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <button
      type={type}
      className={className}
      style={(secured && !confirmed) || disabled ? { opacity: "0.5", cursor: "default" } : {}}
      onClick={(e) => {
        if (e.target.name === "checkbox-confirmation" || (secured && !confirmed)) return;
        if (confirmed) setConfirmed(false);
        onClick(e);
      }}
      disabled={disabled}
    >
      {children}{" "}
      {secured && (
        <input
          type="checkbox"
          checked={confirmed}
          style={{ cursor: "pointer", marginLeft: "5px", height: "10px" }}
          onChange={(e) => {
            e.stopPropagation();
            setConfirmed((value) => !value);
          }}
          name={"checkbox-confirmation"}
        />
      )}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  secured: PropTypes.bool,
};

Button.defaultProps = {
  className: "button",
  type: "button",
  onClick: () => {},
  secured: false,
};

export default memo(Button);
