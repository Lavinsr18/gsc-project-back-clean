// backend/index.js (ya jahan API defined hai)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/api/data", (req, res) => {
  const mockData = [
    {
      keys: ["Discover falahbits - Top Digital Marketing Agency | Agencyspot"],
      clicks: 120,
      impressions: 3000,
      ctr: 0.04,
      position: 2.3,
    },
    {
      keys: ["AdTech Hub - Trusted Marketing Agency for Growth | Agencyspot"],
      clicks: 90,
      impressions: 2400,
      ctr: 0.0375,
      position: 3.1,
    },
    {
      keys: ["ADAM 4 Business - SEO, PPC & Social Media Experts | Agencyspot"],
      clicks: 30,
      impressions: 1500,
      ctr: 0.02,
      position: 5.8,
    },
  ];

  res.json(mockData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Mock backend running on port ${PORT}`));
