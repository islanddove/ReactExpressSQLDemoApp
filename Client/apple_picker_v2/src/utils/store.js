import { createStore, combineReducers } from "redux";
import { appleInfo }  from "./constants";

import { cloneDeep } from "lodash";

// action types
export const SET_USERNAME = "SET_USERNAME";
export const CLEAR_USERNAME = "CLEAR_USERNAME";
export const ADD_WIN_TO_LEADERBOARD = "ADD_WIN_TO_LEADERBOARD";
export const RESET_LEADERBOARD = "RESET_LEADERBOARD";


// action creators
export const setUsername = username => ({
    type: SET_USERNAME,
    username
});

export const clearUsername = () => ({
    type: CLEAR_USERNAME
});

export const addWinToLeaderboard = id => ({
    type: ADD_WIN_TO_LEADERBOARD,
    id
});

export const resetLeaderboard = () => ({
    type: RESET_LEADERBOARD
});

// reducers
export const username = (state = "", action) => {
    switch (action.type) {
        case SET_USERNAME:
            return action.username;
        case CLEAR_USERNAME:
            return "";
        default:
            return state;
    }
};

export const leaderboard = (state = cloneDeep(appleInfo).map(apple => { apple.wins = 0; return apple }), action) => {
    switch (action.type) {
        case ADD_WIN_TO_LEADERBOARD: {
            return state.map( apple => { if (apple.id === action.id) apple.wins++; return apple })
                        .sort((a,b) => b.wins - a.wins);
        }
        case RESET_LEADERBOARD:
            return state.map(apple => { apple.wins = 0; return apple })
        default:
            return state;
    }
};

export const reducers = combineReducers({
    username,
    leaderboard
});
  
// store
export default createStore(reducers);