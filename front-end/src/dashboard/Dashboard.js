import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date)

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
  }

  const reservation = reservations.map((reservation, index) => {
    return (
      <tr key={index+1}>
        <th scope="row">{index + 1}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td >{reservation.people}</td>
      </tr>
    );

})


const content = (
  <table className="table table-striped table-dark">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First Name</th>
        <th scope="col">Last Name</th>
        <th scope="col">Mobile Number</th>
        <th scope="col">Date</th>
        <th scope="col">Time</th>
        <th scope="col">Number of People</th>
      </tr>
    </thead>
    <tbody>{reservation}</tbody>
  </table>
);

  return (
    <main>
      <h1>Dashboard</h1>
      <button type="button" name="previous" onClick={clickHandler} className="btn btn-dark mr-1"><span className="oi oi-arrow-thick-left"></span> Previous</button>
      <button type="button" name="today" onClick={clickHandler} className="btn btn-dark">Today</button>
      <button type="button" name="next" onClick={clickHandler} className="btn btn-dark ml-1">Next <span className="oi oi-arrow-thick-right"></span></button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {content}
    </main>
  );
}

export default Dashboard;
