require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());

// Define scopes for Google Search Console API
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

// Parse the GOOGLE_CREDENTIALS from environment variables
const credentials = JSON.parse(
  process.env.GOOGLE_CREDENTIALS.replace(/\\n/g, '\n')
);

// Create JWT client
const jwt = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

// Initialize Google Search Console API
const searchconsole = google.searchconsole({
  version: 'v1',
  auth: jwt,
});

// API route to get data from GSC
app.get("/api/data", async (req, res) => {
  try {
    await jwt.authorize();
    const response = await searchconsole.searchanalytics.query({
      siteUrl: "https://gsc-project-mu.vercel.app/",
      requestBody: {
        startDate: "2024-03-01",
        endDate: "2025-05-01",
        dimensions: ["page"],
        rowLimit: 10,
      },
    });
    res.json(response.data.rows || []);
  } catch (err) {
    console.error("GSC API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
