import React, { useEffect, useState } from "react";
import SpinnerFullPage from "../components/divers/SpinnerFullPage";
import { useOutletContext } from "react-router-dom";
import SortableTable from "../components/divers/SortableTable";
import { useAppContext } from "../contexts/AppContext";

const AdminPage = () => {
  const { portfolioList } = useOutletContext();
  const {
    confirmService: { requestConfirm, ConfirmModalComponent },
  } = useAppContext();

  const headers = [
    // { name: "Id", key: "userid", sortable: false, width: "200px" },
    { name: "Name", key: "name", sortable: true, width: "70%" },
    { name: "Role", key: "role", sortable: false },
  ];

  const handleRowClick = async id => {
    // console.log("Row clicked, item ID:", id);
    await requestConfirm(
      <div className={"inline-popup"}>
        <h2></h2>
        <div>
          Perform custom action with userid <em>{id}</em>
        </div>
      </div>,
      [{ label: "Close", value: true }]
    );
  };

  if (!portfolioList) return <SpinnerFullPage />;

  return (
    <div className={"inline-section"}>
      <hr />
      <div className={"inline-content"}>
        <div>
          <div>
            <SortableTable data={portfolioList} headers={headers} itemsPerPage={10} displaySearch={true} keyAttribute="userid" onRowClick={handleRowClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
