import React from "react";

import { connect } from "react-redux";
import { setUsername, clearUsername } from "../utils/store";

import { debounce } from "lodash";


/** Home Page */
class Home extends React.Component {

    onChange = debounce((username) => {
        this.props.setUsername(username);
    }, 300);

    render(){
        return (
        <form>
            <p>{this.props.username ? "" : "Enter a User Name to proceed:"} </p>
            <input
                type='text'
                onChange={(e) => this.onChange(e.target.value)}
            />
            <div>Current Username: {this.props.username ? this.props.username : "N/A"}</div>
        </form>
        );
    }
}

const mapState = state => ({
    username: state.username
});

const mapActions = {
    setUsername,
    clearUsername
}

export default connect(mapState, mapActions)(Home);