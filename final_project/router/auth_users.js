const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 100 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send({ message: "User successfully logged in"});
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let username = req.session.authorization.username
  let review = req.body.review
  let book = books[isbn] 
  if(username) {
    
    if (review) {
      book["reviews"][username] = review
    }
  }
  
  return res.status(200).json(book);
});
// delete a book review based on her username only
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let username = req.session.authorization.username
  let book = books[isbn] 
  if(username) {
    delete book["reviews"][username];
  }
  
  return res.status(200).json(book);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
