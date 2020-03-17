import React from "react";

import { connect } from "react-redux";
import { setUsername } from "../utils/store";
import { appleInfo as leaderboard} from "../utils/constants"

import { ImageView, Button, ListWinners as List } from "./StatelessFunctionalComponents";
import "../css/Picker.css";

/** Apple Picker */
class Picker extends React.Component {

    constructor(props) {
        super(props);

        // Set user to the result of the URL param
        const urlUsername = this.props.match.params.username;
        if (urlUsername !== this.props.username) this.props.setUsername(urlUsername);

        // Do not use Redux for apple data, since it does not need to be persisted across routes
        this.state = { leftApple: {}, rightApple: {}, selectedimage: "", leaderboard: [] };
    }

    async componentDidMount () {
        try {
            const { leftApple, rightApple } = await this.getNewApples();

            leaderboard.forEach(apple => apple.wins = 0);

            this.setState({
                leftApple: leftApple,
                rightApple: rightApple,
                selectedimage: "none",
                leaderboard: leaderboard
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
            let leaderboard = this.state.leaderboard;

            if (this.state.selectedimage === "left") {
                await this.submitWinnerToAPI(this.state.leftApple);
                leaderboard.forEach(apple => { if (apple.id === this.state.leftApple.id) apple.wins++; });
            }
            if (this.state.selectedimage === "right") {
                await this.submitWinnerToAPI(this.state.rightApple);
                leaderboard.forEach(apple => { if (apple.id === this.state.rightApple.id) apple.wins++; });
            }

            leaderboard.sort(function (a, b) {
                if (a.wins < b.wins) return 1;
                if (a.wins > b.wins) return -1;
                return 0;
            });

            const {leftApple, rightApple} = await this.getNewApples();

            this.setState({
                leftApple: leftApple,
                rightApple: rightApple,
                selectedimage: "none",
                leaderboard: leaderboard
            });
        }
        catch (error) {
            console.log(error);
            alert("could not submit apple!");
        }
    }

    async submitWinnerToAPI (apple) {
        const response = await fetch("/postWinner", {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                appleId: apple.id,
                username: this.props.username
            })
        });

        if (!response.ok) throw new Error(response);
        return await response.json();        
    }

    render() {
        return (
            <div className="App">
                <h1>Pick an Apple</h1>
                <div className = "Images">
                    <ImageView
                        src={this.state.leftApple.picture}
                        class={this.state.selectedimage === "left" ? "ImageViewSelected" : "ImageView"}
                        onClick={() => this.setState({selectedimage: "left"})}
                        text={this.state.leftApple.name}
                    />
                    <ImageView
                        src={this.state.rightApple.picture}
                        class={this.state.selectedimage === "right" ? "ImageViewSelected" : "ImageView"}
                        onClick={() => this.setState({selectedimage: "right"})}
                        text={this.state.rightApple.name}
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
                    <List
                        sortedWins={this.state.leaderboard}
                    />
                </div>
            </div>
        );
    }
}

const mapState = state => ({
    username: state.username
});
const mapActions = { setUsername };
export default connect(mapState, mapActions)(Picker);
