import React, {useState} from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { searchReservation } from "../utils/api";


const SearchReservation = () =>{

    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [searchError, setSearchError] = useState(null);



    const changeHandler = (event) => setMobileNumber(event.target.value);


    const ac = new AbortController();
    const searchHandler = async (event) => {
        setReservations([]);
        event.preventDefault();
        try {
            const data = await searchReservation(mobileNumber,ac.signal);
            setMobileNumber("");
            //console.log(reservations)
            setReservations([...data])
        } catch (error) {
            setSearchError(error)
        }
    }

    const reservation = reservations.map((reservation, index) => {
        return (
          <tr className="table-secondary" key={reservation.reservation_id}>
            <th scope="row">{index + 1}</th>
            <td>{reservation.first_name} {reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{(reservation.reservation_time)}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
            <td>button</td>
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
        </tr>
      </thead>
      <tbody>{reservation}</tbody>
    </table>
  );

    const content = (
      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a customer's phone number"
          aria-label="Enter a customer's phone number"
          aria-describedby="button-addon2"
          name="mobile_number"
          onChange={changeHandler}
          value={mobileNumber} 
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={searchHandler}
          >
            Find
          </button>
        </div>
      </div>
    );




    return (
      <div>
        <h2>Search Reservation</h2>
        <ErrorAlert error={searchError} />
        {reservationsTable}
        {content}
      </div>
    );
};

export default SearchReservation;