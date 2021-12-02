import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";
import ReservationOperation from "./ReservationOperation";


const EditReservation = () => {

    const [reservation, setReservation] = useState({});
    const [updateError, setUpdateError] = useState(null);
    const { reservation_id } = useParams();

    useEffect(()=>{
        setUpdateError(null);
        setReservation([]);
        const ac = new AbortController();
        const loadReservation = async() => {
            try {
                const data = await readReservation(reservation_id, ac.signal);
                setReservation(data);
            } catch (error) {
                setUpdateError(error)
            }
        }
        loadReservation();
        return () => ac.abort();
    }, [reservation_id])


  return (
    <>
      <h2>Update Reservation</h2>
      <ErrorAlert error={updateError} />
      <ReservationOperation reservation={reservation} isNew={false} />
    </>
  );
};

export default EditReservation;