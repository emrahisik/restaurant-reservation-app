import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time"
import ReservationsTable from "./ReservationsTable";
import TablesTable from "./TablesTable";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [updateTables, setUpdateTables] = useState(false)
  const history = useHistory()

  const clickHandler = ({target}) =>{
    if(target.name === "previous"){
      history.push(`/dashboard?date=${previous(date)}`);
    };
    if(target.name === "today"){
      history.push(`/dashboard?date=${today()}`);
    };
    if(target.name === "next"){
      history.push(`/dashboard?date=${next(date)}`);
    };
  };

  useEffect(loadDashboard, [date, updateTables]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
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
  }, [updateTables]);

  let reservationDate = new Date(date);
  reservationDate = new Date(
    reservationDate.getUTCFullYear(),
    reservationDate.getUTCMonth(),
    reservationDate.getUTCDate()
  ).toDateString();

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
          Reservations for {reservationDate}
        </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div className="d-flex flex-wrap">
      <div className="row">
        <ReservationsTable reservations={reservations} errorHandler={setReservationsError} setUpdateTables={setUpdateTables} updateTables={updateTables}/>
        <TablesTable tables={tables} errorHandler={setTablesError} setUpdateTables={setUpdateTables} updateTables={updateTables}/>
      </div>
      </div>
    </main>
  );
};

export default Dashboard;
