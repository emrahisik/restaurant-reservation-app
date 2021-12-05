import React from "react";
import { deleteReservation } from "../utils/api";



/**
 * Defines the tables table on dashboard page.
 * The table has only one button for each table: Finish.
 * @param tables
 * the array of tables
 * @param errorHandler
 * sets the error returned by the api response to the dashboard (parent) component.
 * @param setUpdateTables
 * each time a reservation cancelled changes updateTables status to re-render table's table.
 * @param updateTables
 * a boolean prop, which is a state variable controls the useEffect to re-render table's table.
 * @returns {JSX.Element}
 */

function TablesTable({ tables, errorHandler, setUpdateTables, updateTables }) {

const deleteHandler = (event, table_id) => {
  const confirmation = window.confirm("Is this table ready to seat new guests?\nThis cannot be undone.");
  if(confirmation){
    (async function(){
      try {
        await deleteReservation(table_id);
        setUpdateTables(!updateTables)
      } catch (error) {
        errorHandler(error);
      }
    })();
  }
};

const finishButton = (table_id) => (
  <button
    className="btn btn-dark py-0"
    data-table-id-finish={table_id}
    onClick={(event) => deleteHandler(event, table_id)}
  >
    Finish
  </button>
);

const table = tables.map((table,index) => {
  return (
    <tr className="table-secondary" key={table.table_id}>
        <th scope="row">{index + 1}</th>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free "}</td>
        <td>{table.reservation_id ? finishButton(table.table_id) : null}</td>
      </tr>
  );
});


const tablesTable = (
  <table className="table table-striped table-light">
    <thead className="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Table Name</th>
        <th scope="col">Capacity</th>
        <th scope="col">Status</th>
        <th scope="col">Finish</th>
      </tr>
    </thead>
    <tbody>{table}</tbody>
  </table>
);

  return <div className="mx-2">{tablesTable}</div>;
};

export default TablesTable;
