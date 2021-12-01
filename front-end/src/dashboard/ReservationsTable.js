import { formatAsTime } from "../utils/date-time"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function ReservationsTable({ reservations, errorHandler }) {

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
          className="btn btn-primary py-0"
          href={`/reservations/${reservation_id}/edit`}
          role="button"
        >
          Edit
        </a>
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
        </tr>
      </thead>
      <tbody>{reservation}</tbody>
    </table>
  );

  return <div className="col-lg-7 ">{reservationsTable}</div>;
}

export default ReservationsTable;
