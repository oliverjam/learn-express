const express = require("express");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const templates = require("./templates");

const server = express();

let posts = [{ author: "oli", title: "hello", content: "lorem ipsum etc" }];

server.use(cookieParser());
server.use(express.urlencoded());

server.get("/", (req, res) => {
  const email = req.cookies.email;
  const html = templates.home(email);
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

server.post("/new-post", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/posts");
});

server.get("/posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templates.post(post);
  res.send(html);
});

server.get("/delete-post/:title", (req, res) => {
  posts = posts.filter((p) => p.title !== req.params.title);
  res.redirect("/posts");
});

server.get("/log-in", (req, res) => {
  const html = templates.logIn();
  res.send(html);
});

server.post("/log-in", (req, res) => {
  const email = req.body.email;
  res.cookie("email", email, { maxAge: 600000 });
  res.redirect("/");
});

server.get("/log-out", (req, res) => {
  res.clearCookie("email");
  res.redirect("/");
});

server.use(express.static("workshop/public"));

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
