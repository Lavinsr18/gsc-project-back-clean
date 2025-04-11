const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const KEY = require('./credentials.json'); // Replace with your service account file

const jwt = new google.auth.JWT(
  KEY.client_email,
  null,
  KEY.private_key,
  SCOPES
);

const searchconsole = google.searchconsole({
  version: 'v1',
  auth: jwt,
});

app.get("/api/data", async (req, res) => {
  try {
    await jwt.authorize();
    const response = await searchconsole.searchanalytics.query({
      siteUrl: "https://gsc-project-mu.vercel.app/", // Replace with your verified site
      requestBody: {
        startDate: "2024-03-01",
        endDate: "2025-05-01",
        dimensions: ["page"],
        rowLimit: 10,
      },
    });
    res.json(response.data.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
