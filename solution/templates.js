function layout(content) {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Learn Express</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/new-post">Write new post</a>
            <a href="/posts">All posts</a>
          </nav>
        </header>
        ${content}
      </body>
    </html>
  `;
}

function home(email) {
  if (email) {
    return layout(/*html */ `
      <h1>Welcome back ${email}</h1>
      <a href="/log-out">Log out</a>
    `);
  } else {
    return layout(/*html */ `
      <h1>Learn Express</h1>
      <a href="/log-in">Log in</a>
    `);
  }
}

function newPost() {
  return layout(/*html */ `
    <h1>Add a new post</h1>
    <form action="/new-post" method="POST">
      <label for="author">
        Your name<span aria-hidden="true">*</span>
      </label>
      <input id="author" type="text" name="author" required>

      <label for="title">
        Post title<span aria-hidden="true">*</span>
      </label>
      <input id="title" type="text" name="title" required>

      <label for="content">Post content</label>
      <textarea id="content" name="content"></textarea>

      <button type="submit">Save post</button>
    </form>
  `);
}

function allPosts(posts) {
  return layout(/*html */ `
    <h1>All posts</h1>
    <ul>
      ${posts
        .map(
          (post) => `
          <li>
            <a href="/posts/${post.title}">${post.title}</a>
            <a href="/delete-post/${post.title}" aria-label="Delete post titled ${post.title}">🗑</a>
          </li>
        `
        )
        .join("")}
    </ul>
  `);
}

function post(post) {
  return layout(/*html */ `
    <h1>${post.title}</h1>
    <main>${post.content}</main>
    <div>Written by ${post.author}</div>
  `);
}

function logIn() {
  return layout(/*html */ `
    <h1>Log in to your account</h1>
    <form action="/log-in" method="POST">
      <label for="email">
        Your email<span aria-hidden="true">*</span>
      </label>
      <input id="author" type="email" name="email" required>
      <button type="submit">Log in</button>
    </form>
  `);
}

module.exports = { home, newPost, allPosts, post, logIn };
