import React from "react";
import { deleteReservation } from "../utils/api";



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function TablesTable({ tables, errorHandler, setUpdateTables, updateTables }) {


// onClick handler pops up a confirmation window (window.confirm)
// takes the result confirmation and if it is ok, makes and api call to delete id
// can use a delete control state to fetch the tables list from the backend again
const deleteHandler = (event, table_id) => {
  const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
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
}


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
  )
})


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
)

  return <div className="col-lg-5 ">{tablesTable}</div>;
}

export default TablesTable;
