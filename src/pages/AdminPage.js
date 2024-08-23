import React, { useEffect, useState } from "react";
import SpinnerFullPage from "../components/divers/SpinnerFullPage";
import { useOutletContext } from "react-router-dom";
import SortableTable from "../components/divers/SortableTable";
import styles from "./Home.module.css";

const AdminPage = () => {
  const { portfolioList } = useOutletContext();

  const headers = [
    // { name: "Id", key: "userid", sortable: false, width: "200px" },
    { name: "Name", key: "name", sortable: true, width: "70%" },
    { name: "Role", key: "role", sortable: false },
  ];

  const handleRowClick = (id) => {
    console.log("Row clicked, item ID:", id);
    // Add your custom logic here
  };

  if (!portfolioList) return <SpinnerFullPage />;

  return (
    <div className={styles.aboutUs}>
      <hr />
      <div className={styles.content}>
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
