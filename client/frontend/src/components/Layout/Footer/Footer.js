import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <Link to="/about">
        <div className="footer__about">About</div>
      </Link>
      <div className="footer__copyright">&copy; Joe Smith 2019</div>
    </footer>
  );
};

export default Footer;
