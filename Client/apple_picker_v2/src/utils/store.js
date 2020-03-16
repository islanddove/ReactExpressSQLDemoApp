import { createStore, combineReducers } from "redux";

// actions
export const setUsername = username => ({
    type: 'SET_USERNAME',
    username
});

export const clearUsername = () => ({
    type: 'CLEAR_USERNAME'
});

// reducers
export const username = (state = "", action) => {
    switch (action.type) {
        case 'SET_USERNAME':
            return action.username;
        case 'CLEAR_USERNAME':
            return "";
        default:
            return state;
    }
};
  
export const reducers = combineReducers({
    username,
    // TODO add more reducers here
});
  
const store = createStore(reducers);
console.log(store.getState()) 

// store
export default createStore(reducers);