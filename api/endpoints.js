import pg from "pg";
const { Pool } = pg;

import { appleInfo } from "./constants.js";

const imgPath = process.env.PORT ? "" : "http://localhost:3010";

const appleInfoEnv = appleInfo.map(apple => {apple.picture = imgPath + apple.picture; return apple;});

const database = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/davidolsen",
    ssl: process.env.DATABASE_URL ? true : false
});

export const getComparisonData = (req, res) => {
    let index1 = Math.floor(Math.random() * 11);
    let index2 = Math.floor(Math.random() * 11);

    //If same, pick new number until different 🤷‍♂️
    while (index1 === index2) index2 = Math.floor(Math.random() * 11);

    const comparisonData = { leftApple: appleInfoEnv[index1], rightApple: appleInfoEnv[index2] };
    res.json(comparisonData);
}

export const postWinner = async (req, res) => {
    /** Send Result to DB! */
    try {
        const leftAppleId = req.body.leftAppleId;
        const rightAppleId = req.body.rightAppleId;
        const winningAppleId = req.body.winner === "left" ? leftAppleId : rightAppleId;

        const username = req.body.username;

        let userRecord = await database.query("SELECT * FROM Users WHERE username = $1", [username]);
        if ( !userRecord.rows[0] ) userRecord = await database.query("INSERT INTO Users(username) VALUES($1) RETURNING *;", [username]);
        const user = userRecord.rows[0];

        let pickerRecord = await database.query("INSERT INTO ApplePickerResults(user_id,leftApple_id,rightApple_id,winningApple_id,created_on) VALUES($1,$2,$3,$4,$5) RETURNING *;",
                                                [user.id, leftAppleId, rightAppleId, winningAppleId, new Date()]);
        
        res.status(200).json({winner: pickerRecord.rows[0]});
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}

export const getTotalWinsAllTime = async (req, res) => {
    try {
        const totalWinReport = `
        SELECT
            SUM(CASE WHEN winningapple_id = 0 THEN 1 ELSE 0 END) as "0",
            SUM(CASE WHEN winningapple_id = 1 THEN 1 ELSE 0 END) as "1",
            SUM(CASE WHEN winningapple_id = 2 THEN 1 ELSE 0 END) as "2",
            SUM(CASE WHEN winningapple_id = 3 THEN 1 ELSE 0 END) as "3",
            SUM(CASE WHEN winningapple_id = 4 THEN 1 ELSE 0 END) as "4",
            SUM(CASE WHEN winningapple_id = 5 THEN 1 ELSE 0 END) as "5",
            SUM(CASE WHEN winningapple_id = 6 THEN 1 ELSE 0 END) as "6",
            SUM(CASE WHEN winningapple_id = 7 THEN 1 ELSE 0 END) as "7",
            SUM(CASE WHEN winningapple_id = 8 THEN 1 ELSE 0 END) as "8",
            SUM(CASE WHEN winningapple_id = 9 THEN 1 ELSE 0 END) as "9",
            SUM(CASE WHEN winningapple_id = 10 THEN 1 ELSE 0 END) as "10"
        FROM ApplePickerResults;
        `;

        const totalWinsRecord = await database.query(totalWinReport);

        res.status(200).json({winners: totalWinsRecord.rows[0]});
        return;
    } catch (err) {
        res.sendStatus(500);
        return;
    }
}