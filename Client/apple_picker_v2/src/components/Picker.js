import React from "react";

import { connect } from "react-redux";
import { setUsername } from "../utils/store";

/** Apple Picker */
class Picker extends React.Component {

    constructor(props) {
        super(props);
        const urlUsername = this.props.match.params.username;
        // Set user to the result of the URL param
        if (urlUsername !== this.props.username) this.props.setUsername(urlUsername);
    }

    render(){
        return (
            <h2>Picker: {this.props.username}</h2>
        );
    }
}

const mapState = state => ({
    username: state.username
});

const mapActions = { setUsername };

export default connect(mapState, mapActions)(Picker);