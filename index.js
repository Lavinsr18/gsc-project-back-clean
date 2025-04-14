// backend/index.js (ya jahan API defined hai)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const useMockData = true; // ← yeh switch on/off karo jab chaho
const mockData = require("./mockData");

app.get("/api/data", async (req, res) => {
  if (useMockData) {
    return res.json(mockData);
  }

  // Actual GSC logic
  try {
    const { google } = require("googleapis");
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const jwt = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/webmasters.readonly']
    );

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: jwt,
    });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
