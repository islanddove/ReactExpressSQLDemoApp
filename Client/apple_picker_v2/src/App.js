import React from "react";
import { BrowserRouter, Switch, Route, Link, Redirect, useParams } from "react-router-dom";

/** Entrypoint to App, as well as the router */
class App extends React.Component {
  constructor() {
    super();
    this.state = {user: "dave"};
  }

  /** Used to make picker link unclickable if a username is not in current state */
  ensureUsernameProvided = (e) => {
    if (this.state.user) return;
    e.preventDefault();
    alert("Need a username to view picker");
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
                <Link to="/reports">Reports</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            {/* Home Route */}
            <Route exact path="/">
                <Home />
            </Route>

            {/* Picker Route. If we have a user, show the picker component. If not, redirect to home. */}
            <Route exact path="/picker">
              {this.state.user ? <Redirect to={`/picker/${this.state.user}`} /> : <Redirect to="/" />}
            </Route>
            <Route path="/picker/:id">
              <Picker />
            </Route>

            {/* Report Route. Allow this to be selected regardless of a user state. */}
            <Route exact path="/reports">
              {this.state.user ? <Redirect to={`/reports/${this.state.user}`} /> : <Reports />}
            </Route>
            <Route path="/reports/:id">
              <Reports />
            </Route>

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

/** Home Page */
class Home extends React.Component {

  


  render(){
    return (
      <h2>Home</h2>
    );
  }
}

/** Apple Picker */
function Picker() {

  let { id } = useParams();
  return <h2>Picker: {id}</h2>;
}

/** Reports */
function Reports() {

  let { id } = useParams();
  return <h2>Reports: {id}</h2>;
}

export default App;
