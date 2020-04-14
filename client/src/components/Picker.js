import React from "react";

import { connect } from "react-redux";
import { setUsername, addWinToLeaderboard, resetLeaderboard } from "../utils/store";

import { ImageView, Button, ListWinners as List } from "./StatelessFunctionalComponents";
import "../css/Picker.css";

/** Apple Picker */
export class Picker extends React.Component {

    constructor(props) {
        super(props);

        const urlUsername = this.props.match.params.username;
        // Set user to the result of the URL param. If the username has changed, clear leaderboard.
        if (urlUsername !== this.props.username) {
            this.props.setUsername(urlUsername);
            this.props.resetLeaderboard();
        }

        this.state = { leftApple: {}, rightApple: {}, selectedimage: "", loading: true };
    }

    async componentDidMount () {
        try {
            const { leftApple, rightApple } = await this.getNewApples();

            this.setState({
                leftApple: leftApple,
                rightApple: rightApple,
                selectedimage: "none",
                loading: false
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    /** 
     * {leftApple: {id, name, picture, wins},
     * rightApple: {id, name, picture, wins}}
     */
    async getNewApples () {
        const newApples = await fetch("/getComparisonData");
        return await newApples.json();
    }

    async submitWinner () {
        if (this.state.selectedimage === "none"){
            alert("Please select an apple!");
            return;
        }
        try {

            const result = {
                leftAppleId: this.state.leftApple.id, 
                rightAppleId: this.state.rightApple.id,
                winner: this.state.selectedimage, 
                username: this.props.username
            };

            await this.sendResultToAPI(result);

            this.props.addWinToLeaderboard(this.state.selectedimage === "left" ? this.state.leftApple.id : this.state.rightApple.id);

            const {leftApple, rightApple} = await this.getNewApples();

            this.setState({
                leftApple: leftApple,
                rightApple: rightApple,
                selectedimage: "none"
            });
        }
        catch (error) {
            console.log(error);
            alert("could not submit apple!");
        }
    }

    async sendResultToAPI (result) {
        const response = await fetch("/postWinner", {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(result)
        });

        if (!response.ok) throw new Error(response);
        return await response.json();        
    }

    render() {

        if (this.state.loading) return null;

        return (
            <div className="App">
                <h1>Pick an Apple, {this.props.username}!</h1>
                <div className = "Images">
                    <ImageView
                        src={this.state.leftApple.picture}
                        class={this.state.selectedimage === "left" ? "ImageViewSelected" : "ImageView"}
                        onClick={() => this.setState({selectedimage: "left"})}
                        text={this.state.leftApple.name}
                        id="left-apple"
                    />
                    <ImageView
                        src={this.state.rightApple.picture}
                        class={this.state.selectedimage === "right" ? "ImageViewSelected" : "ImageView"}
                        onClick={() => this.setState({selectedimage: "right"})}
                        text={this.state.rightApple.name}
                        id="right-apple"
                    />
                </div>
                <div className = "Submit Winner">
                    <Button
                        class={"Button"}
                        onClick={() => this.submitWinner()}
                        text={"Submit an Apple"}
                    />
                </div>
                <div className = "Leaderboard">
                    <h3>Current Leaderboard:</h3>
                    <p> (refresh page or sign in as a different user to reset)</p>
                    <List
                        sortedWins={this.props.leaderboard}
                    />
                </div>
            </div>
        );
    }
}

const mapState = state => ({
    username: state.username,
    leaderboard: state.leaderboard
});
const mapActions = { setUsername, addWinToLeaderboard, resetLeaderboard };
export default connect(mapState, mapActions)(Picker);
