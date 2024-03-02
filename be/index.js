const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const sendEvent = require("./sendEvent.js");
dotenv.config();
const app = express();
app.use(cors());
const port = 3001;
app.use(bodyParser.json());
app.post("/subscribe", require("./sendEvent.js"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
