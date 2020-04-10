import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "fetch-mock";

import { MemoryRouter } from "react-router-dom";
import AppRouter from "../AppRouter";

import { Provider } from 'react-redux';
import store from "../utils/store";

// Note: unlike the other component tests, we cannot pass in the redux state as props, because the router renders sub-components
//       that use the redux store. This is something to note for future application design.
// Note 2: Due to the way this applicaiton is structured, this file is therefore going to be used more for integration tests

// TODO: refactor expected text into constants!
// TODO: add some more integration-style tests where I click on stuff, fill out inputs, etc here.

// References:
// https://testing-library.com/docs/example-react-router
// https://reacttraining.com/react-router/web/guides/testing

const getTwoApples = {
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

const mainReportResponse = {
    winners: [0,1,2,3,4,5,6,7,8,9,10]
};

beforeEach(() => {
    fetchMock.mock("/getTotalWinsAllTime", mainReportResponse);
    fetchMock.mock("/getComparisonData", getTwoApples);
    fetchMock.mock("/postWinner", getTwoApples);
    window.alert = jest.fn();
});

afterEach(() => {
    fetchMock.restore();
    window.alert.mockClear();
});


describe("render tests", () => {

    test("renders Router, default route is text from Home Component", () => {
        const { getByText } =  render( 
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const text = getByText("Current Username: N/A");
        expect(text).toBeInTheDocument();
    });

    test("clicking picker link without username shows an alert", () => {
        const { getByText } =  render( 
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const pickerLink = getByText("Picker");
        expect(pickerLink).toBeInTheDocument();

        fireEvent.click(pickerLink);

        expect(window.alert).toHaveBeenCalledTimes(1);
    });

    test("clicking reports link without username shows an alert", () => {
        const { getByText } =  render( 
            <Provider store={store}>
                <MemoryRouter>
                    <AppRouter />
                </MemoryRouter>
            </Provider>
        );

        const reportLink = getByText("Reports");
        expect(reportLink).toBeInTheDocument();

        fireEvent.click(reportLink);

        expect(window.alert).toHaveBeenCalledTimes(1);
    });
});