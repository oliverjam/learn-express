const express = require("express");
const PORT = process.env.PORT || 3000;

const server = express();

server.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
