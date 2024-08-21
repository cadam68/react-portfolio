import React from "react";
import { Trans as TransI18next, useTranslation } from "react-i18next";

const useComponentTranslation = (componentName) => {
  const { i18n } = useTranslation();

  const Trans = ({ i18nKey, children, ...props }) => {
    const prefixedKey = `${componentName}_${i18nKey}`;
    return (
      <TransI18next i18nKey={prefixedKey} {...props}>
        {children}
      </TransI18next>
    );
  };

  // original method available using : i18n.t("msg_welcome", { param: "XXX" });
  const t = (key, options) => {
    const prefixedKey = `${componentName}_${key}`;
    return i18n.t(prefixedKey, options);
  };

  return { i18n, t, Trans };
};

export default useComponentTranslation;
