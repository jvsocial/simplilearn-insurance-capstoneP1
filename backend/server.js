const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from the ASI Insurance Backend Service.This is backend service!");
});

app.listen(port, () => {
  console.log(`Backend service running at http://localhost:${port}/`);
});
