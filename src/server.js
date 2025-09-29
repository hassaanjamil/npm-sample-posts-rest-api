const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
// const DB_FILE = './src/data/db.json';
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Helper function to read the db.json file
const readDbFile = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { posts: [] }; // Return a default structure if file is not found or invalid
  }
};

// Helper function to write to the db.json file
const writeDbFile = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

app.get('/file', (req, res) => {
  const db = readDbFile();
  res.json(db);
});

// GET all posts
app.get('/posts', (req, res) => {
  const db = readDbFile();
  res.json(db.posts);
});

// GET all comments
app.get('/comments', (req, res) => {
  const db = readDbFile();
  res.json(db.comments);
});

// GET comments by post id
app.get('/comments/:id', (req, res) => {
  const db = readDbFile();
  const id = parseInt(req.params.id);

  const comments = db.comments.filter(c => c.postId === id);

  if (comments.length > 0) {
    res.json(comments);
  } else {
    res.json([]);
    // res.status(404).send('No comments found for this post');
  }
});

// GET a single post by id
app.get('/posts/:id', (req, res) => {
  const db = readDbFile();
  const id = parseInt(req.params.id);
  const post = db.posts.find(p => p.id === id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

app.get('/users/:id', (req, res) => {
  const db = readDbFile();
  const id = parseInt(req.params.id);
  const post = db.users.find(p => p.id === id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send('User not found');
  }
});

// POST (Create) a new post
app.post('/posts', (req, res) => {
  const db = readDbFile();
  const newPost = req.body;
  // Assign a new ID; this is a simple approach.
  const lastId = db.posts.length > 0 ? db.posts[db.posts.length - 1].id : 0;
  newPost.id = lastId + 1;
  db.posts.push(newPost);
  writeDbFile(db);
  res.status(201).json(newPost);
});

// PUT (Update) an existing post
app.put('/posts/:id', (req, res) => {
  const db = readDbFile();
  const id = parseInt(req.params.id);
  const updatedPost = req.body;
  const index = db.posts.findIndex(p => p.id === id);
  if (index !== -1) {
    db.posts[index] = { ...db.posts[index], ...updatedPost, id };
    writeDbFile(db);
    res.json(db.posts[index]);
  } else {
    res.status(404).send('Post not found');
  }
});

// DELETE a post
app.delete('/posts/:id', (req, res) => {
  const db = readDbFile();
  const id = parseInt(req.params.id);
  const initialLength = db.posts.length;
  db.posts = db.posts.filter(p => p.id !== id);
  if (db.posts.length < initialLength) {
    writeDbFile(db);
    res.status(200).send('Post deleted successfully');
  } else {
    res.status(404).send('Post not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
