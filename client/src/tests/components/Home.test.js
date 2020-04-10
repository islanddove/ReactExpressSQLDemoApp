import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { Home } from "../../components/Home";

// Note: in order to prevent an error with the state management code propogate to these tests,
//      all of the functionality of the redux stores are mocked and passed in as props.
//      the reasoning behind this is to keep these tests as atomic and 'unit-testish' as possible.

// TODO: refactor expected text into constants!

describe("prop render tests", () => {

    test("renders Home with all props mocked out", () => {
        // Whenever we add a prop to this component, remember to put it here for reference
        render( 
            <Home
                username=""
                setUsername={jest.fn()}
                resetLeaderboard={jest.fn()}
            />
        );
    });    

    test("displays username when it is provided as a prop", () => {
        const expectedText = "Current Username: dave";

        const { getByText } = render( <Home username="dave" />);
        const text = getByText(expectedText);

        expect(text).toBeInTheDocument();
    });

    test("shows correct message when username is not provided as a prop", () => {
        const expectedText = "Current Username: N/A";

        const { getByText } = render( <Home username="" />);
        const text = getByText(expectedText);
        
        expect(text).toBeInTheDocument();
    });
});

// Test the event-handling functions, and that any prop callbacks are called with the corect args.
describe("event tests", () => {

    test("changing input calls the prop functions with the correct values", () => {
        const mockSetUsername = jest.fn();
        const mockResetLeaderboard = jest.fn();

        const expectedText = "dave";

        const { getByLabelText } = render( <Home setUsername={mockSetUsername} resetLeaderboard={mockResetLeaderboard} />);

        const inputNode = getByLabelText("Enter a User Name to proceed:");        
        fireEvent.change(inputNode, { target: { value: expectedText } });

        // have to use a real timer, or install sinon 💩 https://github.com/facebook/jest/issues/3465
        setTimeout(() => {
            expect(mockSetUsername.mock.calls.length).toBe(1);
            expect(mockResetLeaderboard.mock.calls.length).toBe(1);
            expect(mockSetUsername.mock.calls[0][0]).toBe(expectedText); // set the username with the result of the change event
            done();
        }, 300);
    });
});