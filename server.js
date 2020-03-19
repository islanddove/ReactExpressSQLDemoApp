const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const { Pool } = require('pg');

const database = new Pool({
    connectionString: process.env.DATABASE_URL || "postgres://localhost:5432/davidolsen",
    ssl: process.env.DATABASE_URL ? true : false
});

const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.array());
app.use(express.static(path.join(__dirname, "Client/apple_picker_v2/build")));
app.use(express.static("API/img"));

const imgPath = process.env.PORT ? "" : "http://localhost:3010";

var appleInfo = [
    {
      id: 0,
      name: "HoneyCrisp",
      picture: imgPath + "/apple-honeycrisp.png"
    },
    {
      id: 1,
      name: "Red Delicious",
      picture: imgPath + "/apple-red-delicious.png"
    },
    {
      id: 2,
      name: "Gala",
      picture: imgPath + "/apple-gala.png"
    },
    {
      id: 3,
      name: "Fuji",
      picture: imgPath + "/apple-fuji.png"
    },
    {
      id: 4,
      name: "Granny Smith",
      picture: imgPath + "/apple-grannysmith.png"
    },
    {
      id: 5,
      name: "Golden Delicious",
      picture: imgPath + "/apple-golden-delicious.png"
    },
    {
      id: 6,
      name: "Ambrosia",
      picture: imgPath + "/apple-ambrousia.png"
    },
    {
      id: 7,
      name: "McIntosh",
      picture: imgPath + "/apple-mcIntosh.png"
    },
    {
      id: 8,
      name: "Crispin",
      picture: imgPath + "/apple-crispin.png"
    },
    {
      id: 9,
      name: "JonaGold",
      picture: imgPath + "/apple-jonagold.png"
    },
    {
      id: 10,
      name: "Empire",
      picture: imgPath + "/apple-empire.png"
    }
  ]
  
/** Each request returns two random apples to be compared against each other */
app.get("/getComparisonData", function (req, res) {

    let index1 = Math.floor(Math.random() * 11);
    let index2 = Math.floor(Math.random() * 11);

    //If same, pick new number until different 🤷‍♂️
    while (index1 === index2) index2 = Math.floor(Math.random() * 11);

    const comparisonData = { leftApple: appleInfo[index1], rightApple: appleInfo[index2] };
    res.json(comparisonData);
});

/** Endpoint for submitting a winning apple, and an associated username */
app.post("/postWinner", async function (req, res) {

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
});

app.get("/getTotalWinsAllTime", async function (req, res) {

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
});

app.get("/ping", function (req, res) {
    return res.send("pong");
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "Client/apple_picker_v2/build", "index.html"));
});

app.listen(process.env.PORT || 3010);

module.exports = app;
