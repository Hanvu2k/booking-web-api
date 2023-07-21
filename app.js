const express = require("express");
const routes = require("./routes");
require("dotenv").config();
const { connect } = require("./config/db");

const app = express();
const port = process.env.PORT || 8080;

connect();

routes(app);
app.listen(port);
