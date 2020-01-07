const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");

var mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://wojot:wojtek11@fullstack-app-2mpeu.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Database connected");
});

app.use(express.json());
app.use(cors());
// app.use("/", require("./routes/api/items"));
app.use("/api/items", require("./routes/api/items"));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.options("*", cors());



if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
