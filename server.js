const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

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

// Endpoint for submitting a winning apple, and an associated username
app.post("/postWinner", function (req, res) {

    if (!req.body.username) {
        res.status(400).send({
            success: "false",
            message: "no username"
        });
    }

    if (typeof req.body.leftAppleId !== "number" || req.body.leftAppleId < 0 || req.body.leftAppleId > 10) {
      res.status(400).send({
          success: "false",
          message: "no leftAppleId"
      });
    }

    if (typeof req.body.rightAppleId !== "number" || req.body.rightAppleId < 0 || req.body.rightAppleId > 10) {
      res.status(400).send({
          success: "false",
          message: "no rightAppleId"
      });
    }

    if (!req.body.winner || (req.body.winner !== "left" && req.body.winner !== "right")) {
      res.status(400).send({
          success: "false",
          message: "no winner"
      });
    }

    // TODO - send result to DB!

    res.status(200).send({
        success: "true",
        message: "request recieved"
    });
});

app.get("/ping", function (req, res) {
    return res.send("pong");
});

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "Client/apple_picker_v2/build", "index.html"));
});

app.listen(process.env.PORT || 3010);

module.exports = app;
