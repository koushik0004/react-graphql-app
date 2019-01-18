const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorid: String
});

const authorSchema = new Schema({
    name: String,
    age: Number
});

module.exports = {
    Book: mongoose.model('Book', bookSchema),
    Author: mongoose.model('Author', authorSchema)
};