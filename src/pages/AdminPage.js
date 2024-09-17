import React, { useEffect, useState } from "react";
import SpinnerFullPage from "../components/divers/SpinnerFullPage";
import SortableTable from "../components/divers/SortableTable";
import { useAppContext } from "../contexts/AppContext";
import { FetchService } from "../services/FetchService";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import styles from "./AdminPortfolioPage.module.css";
import ltrim from "validator/es/lib/ltrim";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [inputValues, setInputValues] = useState({ portfolioName: "" });
  const {
    confirmService: { requestConfirm },
  } = useAppContext();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { Toast } = useToast();

  useEffect(() => {
    const fetchData = async controller => {
      const signal = controller.signal;
      try {
        const data = await FetchService().getPortfolioList(true, signal);
        setData(data);
      } catch (err) {
        Toast.error("Session Timeout!");
        if (user) logout();
        navigate(-1);
      }
    };

    const controller = new AbortController();
    fetchData(controller);
  }, []);

  const headers = [
    // { name: "Id", key: "userid", sortable: false, width: "200px" },
    // { name: "Id", key: "userid", sortable: false, width: "70%" },
    { name: "Name", key: "name", sortable: true },
    { name: "Email", key: "email", sortable: false, width: "200px" },
    { name: "Nb visited", key: "nbvisited", sortable: true, width: "30px" },
    { name: "Date visited", key: "lastvisiteddate", sortable: false, width: "250px" },
    { name: "Feature", key: "privilege", sortable: false, width: "200px" },
  ];

  const handleRowClick = async id => {
    navigate(`portfolio/${id}`);
  };

  const handleInputChange = (e, regex) => {
    let { name, value } = e.target;
    value = ltrim(value);
    if (regex.test(value)) setInputValues({ ...inputValues, [name]: value });
  };

  const handleCreateNewPortfolio = async e => {
    navigate("createPortfolio", { state: { portfolioName: inputValues.portfolioName } });
  };

  if (!data) return <SpinnerFullPage />;

  return (
    <div className={"inline-section"}>
      <hr />
      <div className={"inline-content inline-form"}>
        <div className={styles.adminPortfolio}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button disabled={!inputValues.portfolioName} onClick={handleCreateNewPortfolio}>
              Create New Portfolio
            </button>
            <input className={"large"} type="text" name="portfolioName" value={inputValues.portfolioName} placeholder="Portfolio Name" onChange={e => handleInputChange(e, /^.*$/)} size={50} maxLength={40} />
          </div>
        </div>
      </div>
      <hr />
      <div className={"inline-content"}>
        <div>
          <div>
            <SortableTable data={data} headers={headers} itemsPerPage={10} displaySearch={true} keyAttribute="userid" onRowClick={handleRowClick} searchFor={inputValues.portfolioName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
