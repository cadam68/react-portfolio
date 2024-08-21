import React, { memo } from "react";
import "./Hover.css";
import PropTypes from "prop-types";
import { useSettingsContext } from "../../contexts/SettingsContext";

const Hover = ({ caption, enable, visible, children }) => {
  const { firstTime } = useSettingsContext();

  if (visible !== undefined && !visible) return <span>{children}</span>;
  if (visible === undefined && !firstTime) return <span>{children}</span>; // todo - to uncomment for production -
  if (enable !== undefined && !enable) return <span>{children}</span>;

  return (
    <span className="hover-container">
      {children}
      <span className="caption">{caption}</span>
    </span>
  );
};

Hover.propTypes = {
  caption: PropTypes.string.isRequired,
  enable: PropTypes.bool,
  visible: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default memo(Hover);
