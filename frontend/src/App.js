import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import "./App.css";

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
