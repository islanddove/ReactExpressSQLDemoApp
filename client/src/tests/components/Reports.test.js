import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "fetch-mock";

import { Reports } from "../../components/Reports";

// Note: in order to prevent an error with the state management code propogate to these tests,
//      all of the functionality of the redux stores are mocked and passed in as props.
//      the reasoning behind this is to keep these tests as atomic and 'unit-testish' as possible.
// Note: I am also mocking the props passed in with react-router.
// Note: I am also mocking the fetch endpoints for all the tests, since they are called on componentDidMount!

// TODO: refactor expected text into constants!

const mainReportResponse = {
    // to keep things simple, each apple has the same number of wins as its id
    winners: [0,1,2,3,4,5,6,7,8,9,10]
};


describe("prop render tests", () => {

    beforeEach(() => {
        fetchMock.mock("/getTotalWinsAllTime", mainReportResponse);
    });

    afterEach(() => {
        fetchMock.restore();;
    });

    test("renders Reports with all props mocked out", () => {
        // Whenever we add a prop to this component, remember to put it here for reference
        render( 
            <Reports 
                username="dave"
                match={{ params : { username : "dave" }}}
                setUsername={jest.fn()}
                resetLeaderboard={jest.fn()}
            />
        );
    });

    test("displays username when it is provided as a prop", async () => {
        const expectedText = "Hello, dave. Here is a report for the total number of winners:";

        const { getByText } = render( <Reports username="dave" match={{ params : { username : "dave" }}} />);
        
        await wait(() => {
            const text = getByText(expectedText);
            expect(text).toBeInTheDocument();
        });
    });

    test("when username and url param are different on init, clear leaderboard and update username with url param name", () => {

        const mockSetUsername = jest.fn();
        const mockResetLeaderboard = jest.fn();

        render( 
            <Reports 
                username="dave"
                match={{ params : { username : "not dave" }}}
                setUsername={mockSetUsername}
                resetLeaderboard={mockResetLeaderboard}
            />
        );
        
        expect(mockSetUsername.mock.calls.length).toBe(1);
        expect(mockResetLeaderboard.mock.calls.length).toBe(1);
        expect(mockSetUsername.mock.calls[0][0]).toBe("not dave");
    });
});

// Test the event-handling functions. Test that the event both changes the DOM, and that any prop callbacks are called with the corect args.
describe("Test the output of the reports themselves", () => {

    beforeEach(() => {
        fetchMock.mock("/getTotalWinsAllTime", mainReportResponse);
    });

    afterEach(() => {
        fetchMock.restore();;
    });

    test("correctly renders number of apples", async () => {

        const { getAllByText } = render( <Reports username="dave" match={{ params : { username : "dave" }}} />);

        // need ComponentDidMount to finish
        await wait(() => {
            const wins = getAllByText(/(.*?): [0-9]/);
            expect(wins).toHaveLength(11);
        });
    });
});