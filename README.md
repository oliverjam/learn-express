# Learn Express

Express is a minimal framework for building web applications in Node. It would be helpful to read the [Express Introduction](https://github.com/oliverjam/express-intro) first. This workshop will introduce a few Express features that make building servers easier:

1. Routing
1. Dynamic route params
1. Middleware

## Setup

We'll be building a basic blogging app that lets you submit posts, view a list of all posts, view individual posts, and delete individual postsf.

1. Clone this repo
1. Run `npm install` to install dependencies
1. Run `npm run dev` to start the auto-reloading server

The only dependencies are Express and Nodemon—everything we'll be using comes out of the box with Express.

If you open `workshop/server.js` you should see an Express server being created. It currently has no routes, so if you visit http://localhost:3000 you'll see a `404` page.

### Templates

All the HTML we need is already written in `workshop/templates.js`. We'll be focusing on creating route handlers to make our application work.

## Serving pages

Express makes it easy to handle requests for different URLs. We can add routes by calling HTTP method functions on the server object. For example let's create a handler for the `GET /` route:

```js
server.get("/", (req, res) => {
  // handle request here
});
```

Express also provides a helper function for sending a response: `res.send`. We can pass it a string and it will automatically set the `content-type` header to `text/html` for us. Since we have template functions already set up we can call one to get our HTML string:

```js
server.get("/", (req, res) => {
  const html = templates.home();
  res.send(html);
});
```

Visit http://localhost:3000 and you'll see a title and links to other pages. These pages don't exist yet, so we'll have to add handlers for them.

Create a new route for `GET /new-post` that renders `templates.newPost`.

Then create another route for `GET /posts`. This should render `templates.allPosts`. Pass in the `posts` array so the template can render each post. There's currently just one hard-coded post, but we'll adding more soon.

<details>
<summary>Solution</summary>

```js
server.get("/new-post", (req, res) => {
  const html = templates.newPost();
  res.send(html);
});

server.get("/posts", (req, res) => {
  const html = templates.allPosts(posts);
  res.send(html);
});
```

</details>

If you visit http://localhost:3000/new-post you should see the form for creating new posts. If you visit http://localhost:3000/posts you should see the single example post.

## Handling form submissions

Now that we are serving our `/new-post` page correctly we need a route that handles the form submission. Create a handler for the `POST /new-post` route:

```js
server.post("/new-post", (req, res) => {
  // handle submission here
});
```

Now we need to access the POST request body. In a vanilla Node server this would involve manually listening to the request stream and building up the body bit by bit. Luckily Express has something built-in to help.

### Middleware

Express middleware are handler functions that can be chained together. They transform the request in some way, then pass it on to the next handler. There are built-in middleware functions, 3rd party ones and you can even write your own.

Express routes can actually take as many handler arguments as you like after the path argument:

```js
server.get("/", handlerOne, handlerTwo, handlerThree);
```

### Body parsing

Express has built-in middleware functions for parsing POST bodies. Since there are lots of common formats for POST request we need to pick the right one. This is an HTML form submission, which means the `content-type` will be `x-www-form-urlencoded` (e.g. a string like this: `name=oli&title=hello&content=rtest`).

All the built-in middleware are properties of the `express` object we imported. In this case we want `express.urlencoded`. This is a function we have to call (and pass in any options) that _returns_ the middleware function:

```js
server.post("/new-post", express.urlencoded(), (req, res) => {
  console.log(req.body);
});
```

The middleware will handle all the stream stuff, attach the parsed body to the request object, then defer to our handler. So we can use `req.body`, which should be an object with all the values from the form.

Add this new handler, then submit the form at http://localhost:3000/new-post. You should see an object containing the values you submitted logged to your terminal.

Once you have the body parsed you need to "save" the new post. Since we don't want to mess with databases here just push the new post into the `posts` array at the top of the file.

```js
server.post("/new-post", express.urlencoded(), (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
});
```

Finally, use `res.redirect()` to redirect to the `/posts` page.

```js
server.post("/new-post", express.urlencoded(), (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.redirect("/posts");
});
```

Now when you submit the form you should be redirected to a page showing your new post in the list.

## Route params

Each post in the list of posts links to a unique page. For example our test post links to `/posts/hello`. We can't create a static list of every possible route here, since we don't know the post titles ahead of time. Instead we can use "route params", which allow us to use placeholder values in our route paths.

You can create a "param" in your path using a colon (`:`).

```js
server.get("/posts/:title", (req, res) => {
  console.log(req.params.title);
});
```

Express will create an object containing the param values on the request object. So if a user visits `/posts/hello` the above handler will log "hello". If a user visits `/posts/cupcake` it will log "cupcake".

We can use this dynamic value to find the post we want to show, then pass it in to `template.post`:

```js
server.get("/posts/:title", (req, res) => {
  const post = posts.find((p) => p.title === req.params.title);
  const html = templates.post(post);
  res.send(html);
});
```

Add this handler, then click each post in the list on `/posts`. You should see a new page for each containing the post content.

### Deleting posts

Each post in the list also has a delete anchor tag (with a bin icon), which links to something like `/delete-post/hello`.

Add another handler for `GET /delete-post` that uses a route param to get the title of the post to delete. It should then remove that post from the `posts` array and redirect back to the `/posts` page.

**Note**: we are using the `GET` method here, not `DELETE`, because you can only send `DELETE` requests using client-side JS (with `fetch`). Using a link is simpler.

<details>
<summary>Solution</summary>

```js
server.get("/delete-post/:id", (req, res) => {
  posts = posts.filter((p) => p.title !== req.params.title);
  res.redirect("/posts");
});
```

</details>

## Serving static assets

Our page doesn't look that great. We have some CSS in the `public` folder and linked in the `<head>` of each of our pages. However our server isn't serving these files.

In a vanilla Node server we'd have to manually parse each URL for the right extension in order to set the content type, then read the file contents and send them back to the browser.

Luckily Express has built-in middleware for this: `express.static`. This is a function we call with the path to the directory containing our static asset files. It returns the middleware function that serves the files.

Previously we added middleware to a single route (`POST /new-post`). However here we want this to run at the application level, since we don't know what URLs our assets might use. We can tell Express to run middleware for _every_ request with `server.use(handlerFn)`.

Add the static file handling middleware to your app. When you refresh the page you should see some styles take affect.

<details>
<summary>Solution</summary>

```js
server.use(express.static("workshop/public"));
```

</details>
