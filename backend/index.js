const express = require("express");
const app = express();
const cors = require("cors");
const uploadRouter = require("./controllers/uploadController");
require('dotenv').config()

const PORT = process.env.PORT || 4000;

app.use("/images", express.static("public/images"));

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = require("./routes/user");
app.use("/api/v1", user);
app.use("/upload", uploadRouter);

//connect DB
require("./config/database").connect();

app.listen(PORT, () =>
  console.log(`Server has been connected successfully at PORT ${PORT}`)
);
