import React from "react";

import ReservationOperation from "./ReservationOperation";



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
    
  return (
    <>
      <h2>Create Reservation</h2>
      <ReservationOperation initialFormData={initialFormData} isNew={true} />
    </>
  );
};

export default CreateReservation;