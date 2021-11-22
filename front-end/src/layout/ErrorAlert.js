import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string
 *  typically an Error instance. Error returned from API might
 *  be a single error or multiple errors of the same error status.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  return (
    error && (
      <div className="alert alert-danger m-2">
        Encountered following issues:
        <ul>
          {error.message.split("|").map((err, index) => {
            return <li key={index}>{err}</li>;
          })}
        </ul>
      </div>
    )
  );
}

export default ErrorAlert;
