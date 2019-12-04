import React from "react";

import { FaTimes } from "react-icons/fa";

import "./ErrorMessage.css";

const ErrorMessage = props => {
  return (
    <div>
      <div className="error-container">
        {props.errorMessage}
        <span className="error-cancel" onClick={() => props.setShow(false)}>
          <FaTimes />
        </span>
      </div>
    </div>
  );
};

export default ErrorMessage;
