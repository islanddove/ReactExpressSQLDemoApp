import React from "react";

import { connect } from "react-redux";
import { setUsername, clearUsername, resetLeaderboard } from "../utils/store";

import { debounce } from "lodash";


/** Home Page */
export class Home extends React.Component {

    handleChange = debounce((username) => {
        this.props.setUsername(username);
        this.props.resetLeaderboard();
    }, 300);

    render () {
        return (
            <form>
                <label>Enter a User Name to proceed:
                    <input
                        type="text"
                        onChange={(e) => this.handleChange(e.target.value)}
                    />
                </label>
                <div>Current Username: {this.props.username ? this.props.username : "N/A"}</div>
            </form>
        );
    }
}

const mapState = state => ({
    username: state.username
});
const mapActions = { setUsername, clearUsername, resetLeaderboard };
export default connect(mapState, mapActions)(Home);