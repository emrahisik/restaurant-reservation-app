import React, { useState } from "react";
import ReservationOperation from "./ReservationOperation";

/**
 * Creates a reservation invoking the ReservationOperation component.
 * 
 * @returns {JSX.Element}
 */

const CreateReservation = () => {

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

  return (
    <>
      <h1>Create Reservation</h1>
      <ReservationOperation formData={formData} setFormData={setFormData} isNew={true} />
    </>
  );
};

export default CreateReservation;