import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { createReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert"

/**
 * ReservationOperation is a single form component rendered 
 * conditionally by CreateReservation and EditReservation routes.
 * @param formData
 * formData prop is a state variable passed down by either 
 * CreateReservation or EditReservation components
 * @param setFormData
 * setFormData prop is a state variable controller that lifts up 
 * the new formData to parent components
 * @param isNew
 * a boolean determiner which is when true ReservationOperation renders as a new reservation
 * form, else it renders as an update form.
 * @returns {JSX.Element}
 */

const ReservationOperation = ({ formData, setFormData, isNew }) =>{

    const [formError, setFormError] = useState(null);
    const history = useHistory();

    const changeHandler = ({target}) =>{
        setFormData({...formData, [target.name]: target.name === "people" ? Number(target.value) : target.value})
    }; 

    const submitHandler = async (event) =>{
        event.preventDefault();
        const ac = new AbortController();
        try{
            if(isNew){
                await createReservation(formData, ac.signal);
            }else{
                await updateReservation(formData, ac.signal);
            }
            history.push(`/dashboard?date=${formData.reservation_date}`); 
        }catch(error){
            setFormError(error) 
        }      
    };

    const form =    <form onSubmit={submitHandler}>
                        <div className="row">
                        <div className="form-group col">
                            <label htmlFor="first_name">First Name:</label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                className="form-control w-75"
                                onChange={changeHandler}
                                value={formData.first_name}
                                required
                                />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="last_name">Last Name:</label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                className="form-control w-75"
                                onChange={changeHandler}
                                value={formData.last_name}
                                required
                                />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="mobile_number">Mobile Number:</label>
                            <input
                                type="tel"
                                name="mobile_number"
                                id="mobile_number"
                                className="form-control w-75"
                                placeholder="123-456-7890"
                                onChange={changeHandler}
                                value={formData.mobile_number}
                                required
                                />
                        </div>
                        </div>
                        <div className="row">
                        <div className="form-group col">
                            <label htmlFor="reservation_date">Date of Reservation:</label>
                            <input
                                type="date"
                                name="reservation_date"
                                id="reservation_date"
                                className="form-control w-75"
                                onChange={changeHandler}
                                value={formData.reservation_date}
                                required
                                />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="reservation_time">Time of Reservation:</label>
                            <input
                                type="time"
                                name="reservation_time"
                                id="reservation_time"
                                className="form-control w-75"
                                onChange={changeHandler}
                                value={formData.reservation_time}
                                required
                                />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="people">Number of People:</label>
                            <input
                                type="number"
                                name="people"
                                id="people"
                                className="form-control w-75"
                                onChange={changeHandler}
                                value={formData.people}
                                min="1"
                                required
                                />
                        </div>
                        </div>
                        <button type="reset" className="btn btn-secondary mt-3 mx-3" onClick={() => history.goBack()}>Cancel</button>
                        <button type="submit" className="btn btn-primary mt-3" >Submit</button>
                    </form>
                
    return  <>
                <ErrorAlert error={formError} />
                {form}
            </>
};

export default ReservationOperation;