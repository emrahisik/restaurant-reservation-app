import React, {useState} from "react";
import ReservationsTable from "../dashboard/ReservationsTable";
import ErrorAlert from "../layout/ErrorAlert";
import { searchReservation } from "../utils/api";


const SearchReservation = () =>{

    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [notFound, setNotFound] = useState(null)



    const changeHandler = (event) => setMobileNumber(event.target.value);

    const ac = new AbortController();
    const searchHandler = async (event) => {
        event.preventDefault();
        setReservations([]);
        setNotFound(null);
        setSearchError(null);
        try {
            const data = await searchReservation(mobileNumber,ac.signal);
            setMobileNumber("");
            if(data.length){
              setReservations([...data])
            }else{
              setNotFound(<h2>No reservations found</h2>);
            }
            
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

    const reservationsTable = (reservations.length ? <ReservationsTable reservations={reservations} errorHandler={setSearchError} /> : null)


    return (
      <div>
        <h2>Search Reservation</h2>
        <ErrorAlert error={searchError} />
        {content}
        {reservationsTable}
        {notFound}
      </div>
    );
};

export default SearchReservation;