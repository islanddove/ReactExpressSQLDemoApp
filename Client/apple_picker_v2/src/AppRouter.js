import React from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";

import { connect } from "react-redux";

import Home from "./components/Home";
import Picker from "./components/Picker";
import Reports from "./components/Reports";

/** Entrypoint to App, as well as the router */
class AppRouter extends React.Component {

  /** Used to make picker link unclickable if a there is no username */
  ensureUsernameProvided = (e) => {
      if (this.props.username) return;
      e.preventDefault();
      alert("Input a username to view this page!");
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/" >Home</Link>
              </li>
              <li>
                <Link to="/picker" onClick={e => this.ensureUsernameProvided(e)}>Picker</Link>
              </li>
              <li>
                <Link to="/reports" onClick={e => this.ensureUsernameProvided(e)}>Reports</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            
            {/* Home Route */}
            <Route exact path="/" component={Home} />

            {/* Picker Route. If we have a username, show the picker component. If not, redirect to home. */}
            <Route exact path="/picker">
              {this.props.username ? <Redirect to={`/picker/${this.props.username}`} /> : <Redirect to="/" />}
            </Route>
            <Route path="/picker/:username" component={Picker} />

            {/* Report Route. If we have a username, show the report component. If not, redirect to home. */}
            <Route exact path="/reports">
              {this.props.username ? <Redirect to={`/reports/${this.props.username}`} /> : <Redirect to="/" />}
            </Route>
            <Route path="/reports/:username" component={Reports} />

            {/* Wildcard Route. Send back to the home screen. */}
            <Route path="/*">
              <Redirect to="/" />
            </Route>

          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapState = state => ({
    username: state.username
});

export default connect(mapState)(AppRouter);