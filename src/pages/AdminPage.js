import React, { useEffect, useState } from "react";
import SpinnerFullPage from "../components/divers/SpinnerFullPage";
import SortableTable from "../components/divers/SortableTable";
import { useAppContext } from "../contexts/AppContext";
import { FetchService } from "../services/FetchService";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const AdminPage = () => {
  const [data, setData] = useState([]);
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
        const data = await FetchService().fetchPortfolioList(true, signal);
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
    { name: "Role", key: "role", sortable: false, width: "200px" },
  ];

  const handleRowClick = async id => {
    /*
    await requestConfirm(
      <div className={"inline-popup"}>
        <div>
          Perform custom action with userid <em>{id}</em>
        </div>
      </div>,
      [{ label: "Close", value: true }]
    );
    */
    navigate(`portfolio/${id}`);
  };

  if (!data) return <SpinnerFullPage />;

  return (
    <div className={"inline-section"}>
      <hr />
      <div className={"inline-content"}>
        <div>
          <div>
            <SortableTable data={data} headers={headers} itemsPerPage={10} displaySearch={true} keyAttribute="userid" onRowClick={handleRowClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
