import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateTable, listTables } from "../utils/api";

/**
 * renders Seat page with a dropdown menu for all tables exist
 * 
 * @returns {JSX.Element}
 */

const SeatReservation = () => {

    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    useEffect(() => {
      const ac = new AbortController();
      const loadTables = async () => {
        try {
          const tableList = await listTables(ac.signal);
          setTables(tableList);
        } catch (error) {
          setTablesError(error);
        }
      };
      loadTables();
      return () => ac.abort();
    }, []);

    const initialFormData = { table_id: "" };
    const [tableData, setTableData] = useState({ ...initialFormData });
    const [formError, setFormError] = useState(null);
    const { reservation_id } = useParams();

    const history = useHistory();
    const options = tables.map((table) => (
      <option value={table.table_id} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));

    const changeHandler = ({ target }) =>
      setTableData({ ...tableData, [target.name]: target.value });
    
    
    const submitHandler = async (event) => {
      event.preventDefault();
      try {
        await updateTable(reservation_id, tableData.table_id);
        setTableData({ ...initialFormData });
        history.push("/dashboard");
      } catch (error) {
        setFormError(error);
      }
    };

  return (
    <>
    <ErrorAlert error={formError} />
    <ErrorAlert error={tablesError} />
    <form onSubmit={submitHandler}>
    <div className="form-group my-3">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="table_id">
            Tables
          </label>
        </div>
        <select
          className="custom-select"
          id="table_id"
          name="table_id"
          onChange={changeHandler}
          defaultValue={"default"}
        >
          <option value="default" disabled>Choose a table...</option>
          {options}
        </select>
      </div>
      </div>
      <button
          type="reset"
          className="btn btn-secondary mt-3 mx-3"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
    </form>
    </>
  );
};

export default SeatReservation;