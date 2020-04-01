import { cloneDeep } from "lodash";
import { appleInfo } from "../../utils/constants";

// action types
import { SET_USERNAME, CLEAR_USERNAME, ADD_WIN_TO_LEADERBOARD, RESET_LEADERBOARD } from "../../utils/store";

// action creators
import { setUsername, clearUsername, addWinToLeaderboard, resetLeaderboard } from "../../utils/store";

// reducers
import { username, leaderboard } from "../../utils/store";


// actions and action creators
describe( "action creators", () => {
    test("setUsername action", () => {
        const username = "username";
        const expectedAction = {
            type: SET_USERNAME,
            username
        };

        const result = setUsername(username);
        expect(result).toEqual(expectedAction);
    });

    test("clearUsername action", () => {
        const expectedAction = {
            type: CLEAR_USERNAME
        };

        const result = clearUsername();
        expect(result).toEqual(expectedAction);
    });

    test("addWinToLeaderboard action", () => {
        const id = "id";
        const expectedAction = {
            type: ADD_WIN_TO_LEADERBOARD,
            id
        };

        const result = addWinToLeaderboard(id);
        expect(result).toEqual(expectedAction);
    });

    test("resetLeaderboard action", () => {
        const expectedAction = {
            type: RESET_LEADERBOARD
        };

        const result = resetLeaderboard();
        expect(result).toEqual(expectedAction);
    });
});

// reducers - note that I am using the action creators in these tests
describe( "username reducer", () => {
    test("return the initial state", () => {
        const expectedUsername = "";

        const result = username(undefined, {});
        expect(result).toEqual(expectedUsername);
    });

    test("set the username", () => {
        const expectedUsername = "username";

        const action = setUsername(expectedUsername);

        const result = username(undefined, action);
        expect(result).toEqual(expectedUsername);
    });

    test("clear the username", () => {
        const expectedUsername = "";

        const action = clearUsername();

        const result = username("clear me!", action);
        expect(result).toEqual(expectedUsername);
    });
});

describe( "leaderboard reducer", () => {
    test("return the initial state", () => {
        const expectedLeaderboard = cloneDeep(appleInfo).map(apple => { apple.wins = 0; return apple });

        const result = leaderboard(undefined, {});
        expect(result).toEqual(expectedLeaderboard);
    });

    test("add a win to the leaderboard", () => {
        const expectedLeaderboard = cloneDeep(appleInfo).map(apple => { apple.wins = 0; return apple });

        expectedLeaderboard[0].wins++;

        const action = addWinToLeaderboard(0);

        const result = leaderboard(undefined, action);
        expect(result).toEqual(expectedLeaderboard);
    });

    test("reset the leaderboard", () => {
        const expectedLeaderboard = cloneDeep(appleInfo).map(apple => { apple.wins = 0; return apple });

        expectedLeaderboard[0].wins++;

        let action = addWinToLeaderboard(0);

        let result = leaderboard(undefined, action);
        expect(result).toEqual(expectedLeaderboard);

        // reset the leaderboard
        expectedLeaderboard[0].wins--;

        action = resetLeaderboard();

        result = leaderboard(result, action);
        expect(result).toEqual(expectedLeaderboard);
    });
});