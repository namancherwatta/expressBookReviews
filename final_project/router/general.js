const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    console.log("Register route");
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully. You can now log in." });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

public_users.get('/getbooksbypromise', (req, res) => {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books data not found");
        }
    })
    .then((bookList) => res.status(200).json(bookList))
    .catch((error) => res.status(500).json({ message: error }));
});

public_users.get('/promise/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    })
    .then((bookDetails) => res.status(200).json(bookDetails))
    .catch((error) => res.status(404).json({ message: error }));
});

public_users.get('/promise/author/:author', (req, res) => {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found by this author");
        }
    })
    .then((bookList) => res.status(200).json(bookList))
    .catch((error) => res.status(404).json({ message: error }));
});

public_users.get('/promise/title/:title', (req, res) => {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.title === title);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found with this title");
        }
    })
    .then((bookList) => res.status(200).json(bookList))
    .catch((error) => res.status(404).json({ message: error }));
});

module.exports.general = public_users;
