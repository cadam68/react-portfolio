import React, { useState, useMemo } from "react";
import styles from "./SortableTable.module.css";
import { removeDiacritics } from "../../services/Helper";

const SortableTable = ({ data, headers, itemsPerPage, displaySearch, keyAttribute, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(headers.find((header) => header.sortable)?.key || "");
  const [sortDirection, setSortDirection] = useState("asc");

  /* NOTE : PROPS should be IMMUTABLE, create a shallow copy of the array with copied objects if needed
    const dataCopy = data.map(item => ({..item }));
    dataCopy.forEach(item => {
      item.name = `${item.firstname} ${item.lastname}`;
    });
  */

  const [inputValues, setInputValues] = useState({
    searchCriteria: "",
  });

  const handleInputChange = (e, regex) => {
    if (currentPage != 1) setCurrentPage(1);
    const { name, value } = e.target;
    let upperValue = value.toUpperCase();
    if (regex.test(upperValue)) {
      setInputValues({
        ...inputValues,
        [name]: upperValue,
      });
    }
  };

  // Handle sorting logic
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Ensure keyAttribute is valid
  const validKeyAttribute = useMemo(() => {
    if (data.length > 0 && keyAttribute in data[0]) {
      return keyAttribute;
    }
    return undefined;
  }, [data, keyAttribute]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Concatenate only the fields defined in the headers
      const itemString = headers.reduce((acc, header) => {
        const fieldValue = item[header.key] != null ? String(item[header.key]) : "";
        return acc + "," + removeDiacritics(fieldValue).toUpperCase();
      }, "");

      // Perform the filtering on the concatenated string
      return itemString.includes(inputValues.searchCriteria.toUpperCase());
    });
  }, [data, inputValues]);

  // Sort data based on selected column and direction
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Get data to display on the current page
  const displayedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Disable 'Previous' button if on the first page, and 'Next' button if on the last page
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className={styles.sortableTable}>
      {displaySearch && (
        <p>
          Search For &nbsp;
          <input
            type="text"
            name="searchCriteria"
            placeholder="Value"
            value={inputValues.searchCriteria}
            size={21}
            maxLength={15}
            onChange={(e) => handleInputChange(e, /^[A-Z]*$/)}
          />
        </p>
      )}
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key} onClick={() => header.sortable && handleSort(header.key)} style={{ cursor: header.sortable ? "pointer" : "default", width: header.width }}>
                {header.name} {header.sortable && (sortColumn === header.key ? (sortDirection === "asc" ? "🔼" : "🔽") : "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item, index) => (
            <tr
              key={validKeyAttribute ? item[validKeyAttribute] : index} // Use validKeyAttribute if available, otherwise fallback to index
              onClick={validKeyAttribute && onRowClick ? () => onRowClick(item[validKeyAttribute]) : null}
              style={{ cursor: validKeyAttribute && onRowClick ? "pointer" : "default" }}
            >
              {headers.map((header) => (
                <td key={header.key}>{item[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={isPreviousDisabled}>
          Previous
        </button>
        <button onClick={() => setCurrentPage(1)} disabled={isPreviousDisabled}>
          First
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SortableTable;
