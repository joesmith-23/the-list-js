import React from "react";

import "./HamburgerToggleButton.css";

const HamburgerToggleButton = props => (
  <button
    onClick={() => {
      props.toggle();
    }}
    className="toggle-button"
  >
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
    <div className="toggle-button__line" />
  </button>
);

export default HamburgerToggleButton;
