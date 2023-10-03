const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async  (req, res) => {
  //Write your code here
  return  await res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res)  => {
  //Write your code here
  const isbn = req.params.isbn;
  return await res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  let book_with_author = {}
  const author = req.params.author;
  for (var key in books) {

    if (books[key].author === author) {
      book_with_author[key] = books[key]

    }
  }

  return await res.status(200).json(book_with_author);


});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  let book_with_title = {}
  const title = req.params.title;
  for (var key in books) {

    if (books[key].title === title) {
      book_with_title[key] = books[key]

    }
  }

  return await res.status(200).json(book_with_title);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
