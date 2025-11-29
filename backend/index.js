const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const resumeRoutes = require("./routes/resume.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/resume", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
