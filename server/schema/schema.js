const _ = require('lodash');
const { Book, Author } = require('../models');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

//const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;
const booksData = [
    { name: 'My book 1', genre: 'Action', id: '1', authorid: '1' },
    { name: 'The Final Empire', genre: 'Fantacy', id: '2', authorid: '3' },
    { name: 'Name of the wind', genre: 'Fantacy', id: '3', authorid: '2' },
    { name: 'The long Earth', genre: 'Si-Fi', id: '4', authorid: '1' },
    { name: 'My book 13', genre: 'Action', id: '5', authorid: '1' },
    { name: 'The Final Empire return', genre: 'Fantacy', id: '6', authorid: '3' },
    { name: 'Name of the wind revolution', genre: 'Fantacy', id: '7', authorid: '2' },
    { name: 'The long Earth triology', genre: 'Si-Fi', id: '8', authorid: '1' }
];

const authorsData = [
    { name: 'koushik Sadhukhan', age: 30, id: '1' },
    { name: 'Birjo Das', age: 32, id: '2' },
    { name: 'Amar Nath', age: 35, id: '3' }
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //return _.find(authorsData, { id: parent.authorid });
                return Author.findById(parent.authorid);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _.filter(booksData, { authorid: parent.id })
                return Book.find({ authorid: parent.id });
            }
        }
    })
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        AddAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        AddBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorid: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                });
                return book.save();
            }
        }
    })
});
const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //updated code here
                //return _.find(booksData, { id: args.id });
                return Book.findById(args.id);
            }
        },
        allBooks: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return booksData;
                return Book.find({});
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(authorsData, { id: args.id });
                return Author.findById(args.id);
            }
        },
        allAuthors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authorsData;
                return Author.find({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutation
});