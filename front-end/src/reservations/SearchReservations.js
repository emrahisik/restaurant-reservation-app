import React, {useState} from "react";
import ReservationsTable from "../dashboard/ReservationsTable";
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
        //setSearchError(null);
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
            type="submit"
            id="button-addon2"
            onClick={searchHandler}
          >
            Find
          </button>
        </div>
      </div>
    );

    const reservationsTable = (reservations.length ? <ReservationsTable reservations={reservations} errorHandler={setSearchError} /> : <h2>No reservations found</h2>)



    return (
      <div>
        <h2>Search Reservation</h2>
        <ErrorAlert error={searchError} />
        {content}
        {reservationsTable}
      </div>
    );
};

export default SearchReservation;