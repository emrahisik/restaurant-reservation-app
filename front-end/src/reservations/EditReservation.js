import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";
import ReservationOperation from "./ReservationOperation";

/**
 * Edits an existing reservation invoking the ReservationOperation component.
 * Fetches the reservation data to be updated and sends to ReservationOperation
 * 
 * @returns {JSX.Element}
 */

const EditReservation = () => {

    const initialFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        status: "booked",
      };
  
    const [formData, setFormData] = useState({...initialFormData});
    const [updateError, setUpdateError] = useState(null);
    const { reservation_id } = useParams();

    useEffect(() => {
      const ac = new AbortController();
      const loadReservation = async () => {
        try {
          const reservation = await readReservation(reservation_id, ac.signal);
          delete reservation.created_at;
          delete reservation.updated_at;
          setFormData(reservation);
        } catch (error) {
          setUpdateError(error);
        }
      };
      loadReservation();
      return () => ac.abort();
    }, [reservation_id]);

  return (
    <>
      <h2>Update Reservation</h2>
      <ErrorAlert error={updateError} />
      <ReservationOperation formData={formData} setFormData={setFormData} isNew={false} />
    </>
  );
};

export default EditReservation;