const express = require("express");
const PORT = process.env.PORT || 3000;
const templates = require("./templates");

const server = express();

let posts = [{ author: "oli", title: "hello", content: "lorem ipsum etc" }];

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
