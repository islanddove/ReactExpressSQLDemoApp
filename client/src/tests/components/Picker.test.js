import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "fetch-mock";

import { Picker } from "../../components/Picker";

// Note: in order to prevent an error with the state management code propogate to these tests,
//      all of the functionality of the redux stores are mocked and passed in as props.
//      the reasoning behind this is to keep these tests as atomic and 'unit-testish' as possible.
// Note: I am also mocking the props passed in with react-router.
// Note: I am also mocking the fetch endpoints for all the tests, since they are called on componentDidMount!

const appleResponse = {
    leftApple: {
        id: "0",
        name: "leftApple",
        picture: "leftApplePicture",
        wins: "0"
    },
    rightApple: {
        id: "1",
        name: "rightApple",
        picture: "rightApplepicture",
        wins: "0"
    }
};


describe("prop render tests", () => {

    beforeEach(() => {
        fetchMock.mock("/getComparisonData", appleResponse);
    });

    afterEach(() => {
        fetchMock.restore();;
    });

    test("renders Picker with all props mocked out", () => {
        // Whenever we add a prop to this component, remember to put it here for reference
        render( 
            <Picker 
                username="dave"
                leaderboard={[]}
                match={{ params : { username : "dave" }}}
                setUsername={jest.fn()}
                resetLeaderboard={jest.fn()}
                addWinToLeaderboard={jest.fn()}
            />
        );
    });

    test("displays username when it is provided as a prop", () => {
        const expectedText = "Pick an Apple, dave!";

        const { getByText } = render( <Picker username="dave" leaderboard={[]} match={{ params : { username : "dave" }}} />);
        const text = getByText(expectedText);

        expect(text).toBeInTheDocument();
    });

    test("displays leaderboard when it is provided as a prop", () => {

        const leaderboard = [ 
            { name: "name1", wins: 1, id: 0},
            { name: "name2", wins: 2, id: 1}
        ];

        const { getAllByText } = render( <Picker username="" leaderboard={leaderboard} match={{ params : { username : "" }}} />);

        const wins = getAllByText(/name[0-9]: [0-9]/);
        expect(wins).toHaveLength(2);
    });

    test("when username and url param are different on init, clear leaderboard and update username with url param name", () => {

        const mockSetUsername = jest.fn();
        const mockResetLeaderboard = jest.fn();

        render( 
            <Picker 
                username="dave"
                leaderboard={[]}
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
describe("callback and event-handling tests", () => {

    beforeEach(() => {
        fetchMock.mock("/getComparisonData", appleResponse);
        fetchMock.mock("/postWinner", appleResponse);
    });

    afterEach(() => {
        fetchMock.restore();;
    });

    test("clicking on an imageview highlights that imageview", async () => {

        const { getByTestId } = render( 
            <Picker 
                username="dave"
                leaderboard={[]}
                match={{ params : { username : "dave" }}}
            />
        );

        // need ComponentDidMount to finish
        await wait(() => {
            const leftImageView = getByTestId("left-apple");
            expect(leftImageView).toBeInTheDocument();
            expect(leftImageView).toHaveClass("ImageView");

            const rightImageView = getByTestId("right-apple");
            expect(rightImageView).toBeInTheDocument();
            expect(rightImageView).toHaveClass("ImageView");

            // click on the left image
            fireEvent.click(leftImageView);
            expect(leftImageView).toHaveClass("ImageViewSelected");

            // right image class did not change!
            expect(rightImageView).toHaveClass("ImageView");
        });
    });

    test("clicking the Submit Winner button without selecting an Image does not call addWinToLeaderboard", async () => {

        const mockAddWinToLeaderboard = jest.fn();
        window.alert = jest.fn();

        const { getByText } = render( 
            <Picker 
                username="dave"
                leaderboard={[]}
                match={{ params : { username : "dave" }}}
                addWinToLeaderboard={mockAddWinToLeaderboard}
            />
        );

        // need ComponentDidMount to finish
        await wait(() => {
            const button = getByText("Submit an Apple");
            expect(button).toBeInTheDocument();

            // click on the button
            fireEvent.click(button);

            // no apple was submitted
            expect(mockAddWinToLeaderboard.mock.calls.length).toBe(0);

            // alert was raised
            expect(window.alert).toHaveBeenCalledTimes(1);

            window.alert.mockClear();
        });
    });

    test("clicking the Submit Winner button after selecting an Image calls addWinToLeaderboard", async () => {

        const mockAddWinToLeaderboard = jest.fn();

        const { getByText, getByTestId } = render( 
            <Picker 
                username="dave"
                leaderboard={[]}
                match={{ params : { username : "dave" }}}
                addWinToLeaderboard={mockAddWinToLeaderboard}
            />
        );

        const leftImageView = getByTestId("left-apple");
        const button = getByText("Submit an Apple");

        expect(button).toBeInTheDocument();
        expect(leftImageView).toBeInTheDocument();

        // need ComponentDidMount to finish
        await wait(() => {
            expect(leftImageView).toHaveClass("ImageView");
        });

        // click on the left image
        fireEvent.click(leftImageView);
        expect(leftImageView).toHaveClass("ImageViewSelected");

        // click the button!
        fireEvent.click(button);

        // wait for async calls to finish after clicking the button
        await wait(() => {
            // we called addWinToLeaderboard with the left apple Id
            expect(mockAddWinToLeaderboard.mock.calls.length).toBe(1);
            expect(mockAddWinToLeaderboard.mock.calls[0][0]).toBe(appleResponse.leftApple.id);

            // selected image is unselected
            expect(leftImageView).toHaveClass("ImageView");            
        });
    });

});