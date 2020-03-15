import React from "react";
import _ from "lodash";
import { BrowserRouter, Switch, Route, Link, Redirect, useParams } from "react-router-dom";

/** Entrypoint to App, as well as the router */
class App extends React.Component {
  constructor() {
    super();
    // TODO - change to redux store for username fetching/setting!
    this.state = {username: ""};
  }

  /** Used to make picker link unclickable if a username is not in current state */
  ensureUsernameProvided = (e) => {
    if (this.state.username) return;
    e.preventDefault();
    alert("Need a username to view picker!");
  }

  // TODO - change this to use redux store
  setUserName = (username) => {
    this.setState({username: username});
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
                {/* TODO change this to use redux and avoid this callback alltogether */}
                <Home setUserName={(username) => this.setUserName(username)}/>
            </Route>

            {/* Picker Route. If we have a username, show the picker component. If not, redirect to home. */}
            <Route exact path="/picker">
              {this.state.username ? <Redirect to={`/picker/${this.state.username}`} /> : <Redirect to="/" />}
            </Route>
            <Route path="/picker/:id">
              <Picker />
            </Route>

            {/* Report Route. Allow this to be selected regardless of a username state. */}
            <Route exact path="/reports">
              {this.state.username ? <Redirect to={`/reports/${this.state.username}`} /> : <Reports />}
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

  constructor() {
    super();
    // TODO - change to redux store for username fetching/setting!
    this.state = {username: ""};
  }

  onChange = _.debounce((username) => {
    this.setState({username: username});
    this.props.setUserName(username);
  }, 300);

  render(){
    return (
      <form>
        <p>Enter a User Name to proceed:</p>
        <input
          type='text'
          onChange={(e) => this.onChange(e.target.value)}
        />
      </form>
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
