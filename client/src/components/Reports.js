import React from "react";

import { connect } from "react-redux";
import { setUsername, resetLeaderboard } from "../utils/store";

import { cloneDeep } from "lodash";

import { ListWinners as List } from "./StatelessFunctionalComponents";

import { appleInfo }  from "../utils/constants";

/** Reports */
export class Reports extends React.Component {

    constructor(props) {
        super(props);
        const urlUsername = this.props.match.params.username;
        // Set user to the result of the URL param. If the username has changed, clear leaderboard.
        if (urlUsername !== this.props.username) {
            this.props.setUsername(urlUsername);
            this.props.resetLeaderboard();
        }

        this.state = { totalWins: [], userWins: [] };
    }

    async componentDidMount () {
        try {
            let winData = await fetch("/getTotalWinsAllTime");
            const { winners } = await winData.json();

            // Assign values from the wins object to the constant apple array 🤯
            const sortedTotalWins = cloneDeep(appleInfo)
                                    .map(apple => { apple.wins = winners[apple.id]; return apple; })
                                    .sort((a, b) => b.wins - a.wins);
            this.setState({
                totalWins: sortedTotalWins
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    render(){
        return (
            <div>
                <h2>Hello, {this.props.username}. Here is a report for the total number of winners: </h2>
                <List
                    sortedWins={this.state.totalWins}
                />
            </div>
        );
    }
}

const mapState = state => ({
    username: state.username
});
const mapActions = { setUsername, resetLeaderboard };
export default connect(mapState, mapActions)(Reports);