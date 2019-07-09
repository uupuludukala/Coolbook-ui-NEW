import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "./Login.js";

// core components
import Admin from "layouts/Admin.jsx";

import "assets/css/material-dashboard-react.css?v=1.6.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <Login />,
  // <Router history={hist}>
  //   <Switch>
  //     <Route path="/admin" component={Admin} />
  //     {/* <Redirect from="/" to="/admin/dashboard" /> */}
  //     <Redirect from="/" to="/admin/login" />
  //   </Switch>
  // </Router>,
  document.getElementById("root")
);
