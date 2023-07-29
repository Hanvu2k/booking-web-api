require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const { connect } = require("./config/db");

const methods = ["GET", "POST", "PATCH", "DELETE"];
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: methods,
  credentials: true,
};

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));

connect();

routes(app);
app.listen(port);
