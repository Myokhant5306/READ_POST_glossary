const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

MongoClient.connect(
  "mongodb+srv://mk1:komyo@cluster0.du2hd.mongodb.net/glossarydb?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("glossarydb");
    const glossaries = db.collection("glossary");

    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
      glossaries
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { glossary: results });
        });
    });

    app.post("/glossary", (req, res) => {
      glossaries
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

app.listen(3000, function () {
  console.log("listening on 3000");
});
