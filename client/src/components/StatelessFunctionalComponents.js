import React from "react";

/** Helper SFC's */
export const ImageView = props => {
    return (
        <div className={props.class} data-testid={props.id} onClick={props.onClick} >
            <img src={props.src} alt="NOT FOUND"/>
            <p>{props.text}</p>
        </div>
    );
}

export const Button = props => {
    return (
        <button className={props.class} onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export const ListWinners = props => {
    const sortedWins = props.sortedWins;
    const listItems = sortedWins.map((sortedWins) =>
        <li key={sortedWins.id} className='li'>
            {sortedWins.name + ": " + sortedWins.wins}
         </li>
    );
    return (
        <ol className='ol'>
            {listItems}
        </ol>
    );
}