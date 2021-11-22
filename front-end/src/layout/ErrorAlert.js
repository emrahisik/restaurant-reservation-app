import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, or 
 *  an array typically an Error instance. Error returned from API might
 *  be a single error as a string or multiple errors as an array of 
 *  multiple error messsages of the same error status.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {
  let content;
  if (error && Array.isArray(error.message)) {
    content = (
      <ul>
        {error.message.split("|").map((err, index) => {
          return <li key={index}>{err}</li>;
        })}
      </ul>
    );
  } else if (error) {
    content = error.message;
  }

  return (
    <div className="alert alert-danger m-2">
      Encountered following issues:
      {content}
    </div>
  );
}

export default ErrorAlert;
