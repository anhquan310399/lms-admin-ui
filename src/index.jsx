import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import { Provider, teamsTheme } from '@fluentui/react-northstar'
import RedirectRoute from "./app.route";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <Provider theme={teamsTheme}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact render={(props) => <Login {...props} />} />
        <RedirectRoute path="/" exact component={Home}/>
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

