import React from "react";
import { cancelReservation } from "../utils/api";
import { formatAsTime } from "../utils/date-time"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationsTable({ reservations, errorHandler, setUpdateTables, updateTables  }) {

  const seatButton = (reservation_id, status) => {
    return (
      status === "booked" && (
        <a
          className="btn btn-dark py-0"
          href={`/reservations/${reservation_id}/seat`}
          role="button"
        >
          Seat
        </a>
      )
    );
  };

  const editButton = (reservation_id, status) => {
    return (
      status === "booked" && (
        <a
          title="edit"
          className="btn btn-primary py-0"
          href={`/reservations/${reservation_id}/edit`}
          role="button"
        >
          Edit
        </a>
      )
    );
  };


  const deleteHandler = async(event, reservation_id) => {
    try {
      const confirmation = window.confirm("Do you want to cancel this reservation?\nThis cannot be undone.");
      if(confirmation){
        await cancelReservation(reservation_id)
        setUpdateTables(!updateTables)
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteButton = (reservation_id, status) => {
    return (
      status === "booked" && (
        <button
          title="delete"
          className="btn btn-danger py-0"
          onClick={(event) => deleteHandler(event, reservation_id)}
        >
          <span className="oi oi-trash"></span>
        </button>
      )
    );
  };

  const reservation = reservations.map((reservation, index) => {
    return (
      <tr className="table-secondary" key={reservation.reservation_id}>
        <th scope="row">{index + 1}</th>
        <td>
          {reservation.first_name} {reservation.last_name}
        </td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{formatAsTime(reservation.reservation_time)}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>{seatButton(reservation.reservation_id, reservation.status)}</td>
        <td>{editButton(reservation.reservation_id, reservation.status)}</td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          {deleteButton(reservation.reservation_id, reservation.status)}
        </td>
      </tr>
    );
  });

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
          <th scope="col">Status</th>
          <th scope="col">Seat</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>{reservation}</tbody>
    </table>
  );

  return <div className="mx-2">{reservationsTable}</div>;
}

export default ReservationsTable;
