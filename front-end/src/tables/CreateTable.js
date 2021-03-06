import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Creates a new table
 * @returns {JSX.Element}
 */

const CreateTable = () => {

    const initialForm = { table_name: "", capacity: ""};
    const [formData, setFormData] = useState({...initialForm});
    const [tableError, setTableError] = useState(null);
    const history = useHistory();

    const changeHandler = ({target}) => {
        setFormData({...formData, [target.name]: target.name === "capacity" ? Number(target.value) : target.value})
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const ac = new AbortController();
        try {
            await createTable(formData, ac.signal);
            setFormData({...initialForm});
            history.push("/dashboard");
        } catch (error) {
            setTableError(error);
        }
    };

    const form = (
      <form onSubmit={submitHandler}>
        <div className="row">
          <div className="form-group col">
            <label htmlFor="table_name">Table Name:</label>
            <input
              type="text"
              name="table_name"
              id="table_name"
              className="form-control w-75"
              onChange={changeHandler}
              value={formData.table_name}
              required
            />
          </div>
          <div className="form-group col">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              className="form-control w-75"
              onChange={changeHandler}
              value={formData.capacity}
              min="1"
              required
            />
          </div>
        </div>
        <button type="reset" className="btn btn-secondary mt-3 mr-3" onClick={() => history.goBack()}>Cancel</button>
        <button type="submit" className="btn btn-primary mt-3" >Submit</button>
      </form>
    );

    return (
        <div>
            <ErrorAlert error={tableError}/>
            <h1>Create Table</h1>
            {form}
        </div>
    )

};

export default CreateTable;