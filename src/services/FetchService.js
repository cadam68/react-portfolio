import { settings } from "../Settings";
import { Log } from "./LogService";

const logger = Log("FetchService");

const FetchService = () => {
  const getDownloadFile = async (fileUrl, fileName) => {
    const response = await fetch(`${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(fileUrl)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-API-Key": settings.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Could not retrieve the ${fileName} file`);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getDownloadUrl = async (ref, userid, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadUrl?ref=${ref}&userid=${encodeURI(userid)}`, {
        signal: signal,
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
        },
      });
      if (!res.ok) throw new Error(`Something went wrong with fetching downloadUrl data`);
      const data = await res.json();
      logger.debug(`getDownloadUrl : ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") throw err;
    }
  };

  const getDownloadJson = async (downloadUrl, abortCtrl = new AbortController()) => {
    const signal = abortCtrl.signal;
    try {
      const res = await fetch(`${settings.baseApiUrl}/firebase/downloadJson?url=${encodeURIComponent(downloadUrl)}`, {
        signal: signal,
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
        },
      });
      if (!res.ok) throw new Error(`Something went wrong with fetching getDownloadJson data`);
      const data = await res.json();
      logger.debug(`downloadUrls : ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      if (err.name !== "AbortError") throw err;
    }
  };

  const getMarkdownFile = async filePath => {
    let fileUrl = `${settings.baseApiUrl}/firebase/download?url=${encodeURIComponent(filePath)}`;

    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-API-Key": settings.apiKey,
      },
    });

    if (!response.ok) throw new Error(`Could not retrieve the file`);
    const text = await response.text();
    return text;
  };

  const getPortfolioList = async (detailed, abortCtrl) => {
    const signal = abortCtrl.signal;

    const headers = { "X-API-Key": settings.apiKey };
    if (detailed) {
      const token = localStorage.getItem("token");
      headers["Authorization"] = token;
    }

    const res = await fetch(`${settings.baseApiUrl}/${detailed ? "portfolioDetailList" : "portfolioList"}`, {
      method: "GET",
      headers: headers,
      signal: signal,
    });
    if (!res.ok) throw new Error("Something went wrong with fetching portfolioList");
    const data = await res.json();
    return data;
  };

  const getPortfolio = async (userid, action, abortCtrl) => {
    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/portfolio?userid=${encodeURI(userid)}&action=${encodeURI(action)}`, {
      method: "GET",
      headers: {
        "X-API-Key": settings.apiKey,
      },
      signal: signal,
    });
    if (res.status === 404) return undefined; // NOT FOUND

    if (!res.ok) throw new Error("Something went wrong with fetching portfolio");
    const data = await res.json();
    return data;
  };

  const getPortfolioDocumentList = async (userid, abortCtrl) => {
    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/portfolioDocumentList?userid=${encodeURI(userid)}`, {
      method: "GET",
      headers: {
        "X-API-Key": settings.apiKey,
      },
      signal: signal,
    });
    if (res.status === 404) return undefined; // NOT FOUND

    if (!res.ok) throw new Error("Something went wrong with fetching portfolioDocumentList");
    const data = await res.json();
    return data;
  };

  const uploadPortfolioDocument = async (file, userid, abortCtrl = new AbortController()) => {
    const token = localStorage.getItem("token");
    if (!token || !file || !userid) throw new Error("Invalid parameters");

    const signal = abortCtrl.signal;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userid", userid);

    try {
      const response = await fetch(`${settings.baseApiUrl}/firebase/upload`, {
        headers: {
          "X-API-Key": settings.apiKey,
          Authorization: token,
        },
        method: "POST",
        body: formData,
        signal: signal,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data);
      return data;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  };

  const savePortfolio = async (userid, portfolio, abortCtrl = new AbortController()) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": settings.apiKey,
        Authorization: token,
      },
      signal: signal,
      body: JSON.stringify({ userid, portfolio }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errMsg || "Something went wrong with saving portfolio");
    return data;
  };

  const login = async (userid, password, abortCtrl) => {
    const signal = abortCtrl.signal;
    const res = await fetch(`${settings.baseApiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": settings.apiKey,
      },
      signal: signal,
      body: JSON.stringify({ userid, password }),
    });

    if (!res.ok) throw new Error(data.message || "Something went wrong with fetching login");
    const data = await res.json();
    return data;
  };

  // Usage : Check if the token is valid / cf useAuthorization hook
  const isAuthorized = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const res = await fetch(`${settings.baseApiUrl}/auth/authorized`, {
        method: "GET",
        headers: {
          "X-API-Key": settings.apiKey,
          Authorization: token,
        },
      });
      if (!res.ok) throw new Error();
      return true;
    } catch (error) {
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const res = await fetch(`${settings.baseApiUrl}/auth/refreshToken`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": settings.apiKey,
          Authorization: token,
        },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  return { getDownloadFile, getDownloadUrl, getDownloadJson, getMarkdownFile, getPortfolioList, getPortfolio, getPortfolioDocumentList, savePortfolio, uploadPortfolioDocument, login, isAuthorized, refreshToken };
};

export { FetchService };
