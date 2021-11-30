import React, { useEffect, useState } from "react";
import { deleteReservation, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous, formatAsTime } from "../utils/date-time"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [updateTableList, setUpdateTableList] = useState(false)

  const clickHandler = ({target}) =>{
    if(target.name === "previous"){
      setCurrentDate(previous(currentDate));
    };
    if(target.name === "today"){
      setCurrentDate(today());
    };
    if(target.name === "next"){
      setCurrentDate(next(currentDate));
    };
  };

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date:currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  };

  useEffect(() => {
    const ac = new AbortController();
    const loadTables = async () => {
      try {
        const tableList = await listTables(ac.signal);
        setTables(tableList);
      } catch (error) {
        setTablesError(error);
      }
    };
    loadTables();
    return () => ac.abort();
  }, [updateTableList]);

  // onClick handler pops up a confirmation window (window.confirm)
  // takes the result confirmation and if it is ok, makes and api call to delete id
  // can use a delete control state to fetch the tables list from the backend again
  const deleteHandler = (event, table_id) => {
    const confirmation = window.confirm("Is this table ready to seat new guests? This cannot be undone.");
    if(confirmation){
      (async function(){
        try {
          await deleteReservation(table_id);
          setUpdateTableList(!updateTableList)
        } catch (error) {
          setTablesError(error);
        }
      })();
    }
  }

  const reservation = reservations.map((reservation, index) => {
    return (
      <tr className="table-secondary" key={reservation.reservation_id}>
        <th scope="row">{index + 1}</th>
        <td>{reservation.first_name} {reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.people}</td>
        <td><a className="btn btn-dark py-0" href={`/reservations/${reservation.reservation_id}/seat`} role="button">Seat</a></td>
      </tr>
    );

});

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
        <td>{table.table_name} {reservation.last_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free "}</td>
        <td>{table.reservation_id ? finishButton(table.table_id) : null}</td>
      </tr>
  )
})


const reservationsTable = (
  <table className="table table-striped table-light">
    <thead className="thead-dark">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Mobile No</th>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
        <th scope="col">People</th>
        <th scope="col">Seat</th>
      </tr>
    </thead>
    <tbody>{reservation}</tbody>
  </table>
);

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

  return (
    <main>
      <h1>Dashboard</h1>
      <button type="button" name="previous" onClick={clickHandler} className="btn btn-dark mr-1">
        <span className="oi oi-arrow-thick-left"></span> Previous
      </button>
      <button type="button" name="today" onClick={clickHandler} className="btn btn-dark">
        Today
      </button>
      <button type="button" name="next" onClick={clickHandler} className="btn btn-dark ml-1">
        Next <span className="oi oi-arrow-thick-right"></span>
      </button>
      <div className="d-md-flex my-3">
        <h4 className="mb-0">
          Reservations for {new Date(currentDate + "GMT-5").toDateString()}
        </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="d-flex flex-wrap">
      <div className="row">
        <div className="col-lg-7 ">{reservationsTable}</div>
        <div className="col-lg-5 ">{tablesTable}</div>
      </div>
      </div>
    </main>
  );
}

export default Dashboard;
