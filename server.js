import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { getComparisonData, postWinner, getTotalWinsAllTime }  from "./api/endpoints.js";

const app = express();
const upload = multer();

const BUILD_FOLDER = "client/build";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.array());
app.use(express.static(join(__dirname, BUILD_FOLDER)));
app.use(express.static("api/img"));

app.get("/ping", function (req, res) {
    return res.send("pong");
});

/** Each request returns two random apples to be compared against each other */
app.get("/getComparisonData", getComparisonData);

/** Endpoint for submitting a winning apple, and an associated username */
app.post("/postWinner", postWinner);

/** Endpoint for submitting a winning apple, and an associated username */
app.get("/getTotalWinsAllTime", getTotalWinsAllTime);

/** Used to handle client-side routing: https://tylermcginnis.com/react-router-cannot-get-url-refresh/ */
app.get("/*", (req, res) => {
    res.sendFile(join(__dirname, BUILD_FOLDER, "index.html"));
});

app.listen(process.env.PORT || 3010);