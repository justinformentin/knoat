import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContainer from "./AppContainer";
import "./styles/main.scss";

class App extends Component {

  render() {
    return (
      <Router>
        <AppContainer />
      </Router>
    );
  }
}

export default App;
