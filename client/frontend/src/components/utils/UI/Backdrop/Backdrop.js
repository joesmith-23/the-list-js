import React from "react";

import "./Backdrop.css";

const Backdrop = props => {
  return <div onClick={props.toggle} className="backdrop"></div>;
};

export default Backdrop;
