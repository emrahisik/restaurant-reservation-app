import React, {useState} from "react";
import { today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";



const CreateReservation = () =>{
    const initialFormData ={first_name:'', last_name:'', mobile_number:'', reservation_date:'', reservation_time:'', people:'',};
    const [formData, setFormData] = useState(initialFormData);

    
    

    const history = useHistory()
    
    //set setFormData as event.target key-value pairs
    const changeHandler = (event) =>{
        setFormData({...formData, [event.target.name]: event.target.value})
    }; 

    const submitHandler = async (event) =>{
        event.preventDefault();
        const ac = new AbortController();
        await createReservation(formData, ac.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`)
        setFormData(initialFormData);
    };

    const form =    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label htmlFor='first_name'>First Name:</label>
                            <input
                                type='text'
                                name='first_name'
                                id='first_name'
                                className='form-control w-25'
                                onChange={changeHandler}
                                value={formData.first_name}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor='last_name'>Last Name:</label>
                            <input
                                type='text'
                                name='last_name'
                                id='last_name'
                                className='form-control w-25'
                                onChange={changeHandler}
                                value={formData.last_name}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor='mobile_number'>Mobile Number:</label>
                            <input
                                type='tel'
                                name='mobile_number'
                                id='mobile_number'
                                className='form-control w-25'
                                placeholder='123-456-7890'
                                onChange={changeHandler}
                                value={formData.mobile_number}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor='reservation_date'>Date of Reservation:</label>
                            <input
                                type='date'
                                name='reservation_date'
                                id='reservation_date'
                                className='form-control w-25'
                                onChange={changeHandler}
                                value={formData.reservation_date}
                                min={today()}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor='reservation_time'>Time of Reservation:</label>
                            <input
                                type='time'
                                name='reservation_time'
                                id='reservation_time'
                                className='form-control w-25'
                                onChange={changeHandler}
                                value={formData.reservation_time}
                                required
                                />
                        </div>
                        <div className="form-group">
                            <label htmlFor='people'>Number of People:</label>
                            <input
                                type='number'
                                name='people'
                                id='people'
                                className='form-control w-25'
                                onChange={changeHandler}
                                value={formData.people}
                                min='1'
                                required={true}
                                />
                        </div>
                        <button type="reset" className="btn btn-secondary mt-3 mx-3" onClick={() => history.goBack()}>Cancel</button>
                        <button type="submit" className="btn btn-primary mt-3" >Submit</button>
                    </form>
                
    return <>{form}</>
};

export default CreateReservation;