import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { ImageView, Button, ListWinners } from "../../components/StatelessFunctionalComponents";

test("renders ImageView", () => {
    const { getByText } = render(<ImageView text="text"/>);
    const text = getByText("text");
    expect(text).toBeInTheDocument();
});

test("renders Button", () => {
    const { getByText } = render(<Button text="text"/>);
    const text = getByText("text");
    expect(text).toBeInTheDocument();
});

test("renders ListWinners", () => {
    const sortedWins = [ 
        { name: "name1", wins: 1, id: 0},
        { name: "name2", wins: 2, id: 1}
    ];

    const { getAllByText } = render(<ListWinners sortedWins={sortedWins}/>);

    const wins = getAllByText(/name[0-9]: [0-9]/);
    expect(wins).toHaveLength(2);
});