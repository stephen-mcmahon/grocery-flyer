// Simple Node.js/Express proxy for Flipp's flyer API
// Usage: node server.js
// Then, in your frontend, fetch from: http://localhost:3000/flyers?zip=XXXXX

const express = require("express");
const fetch = require("node-fetch"); // v2 or v3 (v3: import('node-fetch'))
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/flyers", async (req, res) => {
  const zip = req.query.zip;
  if (!zip) {
    res.status(400).json({ error: "Missing zip parameter" });
    return;
  }
  const url = `https://api-flip.flipp.com/flipp/flyers?postal_code=${encodeURIComponent(zip)}&locale=en`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlippProxy/1.0)"
      }
    });
    if (!response.ok) {
      res.status(response.status).json({ error: "Flipp API error" });
      return;
    }
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Proxy error", details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Flipp Proxy server running at http://localhost:${PORT}`);
});
