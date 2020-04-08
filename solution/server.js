const express = require("express");
const PORT = process.env.PORT || 3000;
const templates = require("./templates");

const server = express();

let posts = [{ author: "oli", title: "hello", content: "lorem ipsum etc" }];

server.get("/", (req, res) => {
  const html = templates.home();
  res.send(html);
});

server.get("/new-post", (req, res) => {
  const html = templates.newPost();
  res.send(html);
});

server.get("/posts", (req, res) => {
  const html = templates.allPosts(posts);
  res.send(html);
});

server.post("/new-post", express.urlencoded(), (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/posts");
});

server.get("/delete-post/:title", (req, res) => {
  posts = posts.filter((p) => p.title !== req.params.title);
  res.redirect("/posts");
});

server.use(express.static("workshop/public"));

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
