const express = require("express");
const app = express();
const port = 3002;

const parislots_model = require("./parislots_model");
const dext_trg_model = require("./dext_trg_model");
const dextvol_model = require("./dextvol_model");

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3002");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

app.get("/slots", (req, res) => {
  parislots_model
    .getSlots()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/dext-trg", (req, res) => {
  dext_trg_model
    .getDextTrg()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/dext-vol", (req, res) => {
  dextvol_model
    .getDextVol()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
