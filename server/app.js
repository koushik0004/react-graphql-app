const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const schema = require('./schema/schema');

const app = express();

app.use(cors());

const connOptions = { useNewUrlParser: true };
mongoose.connect('mongodb://graphql04:graphql04@ds155823.mlab.com:55823/graphql-playlist', connOptions);
mongoose.connection.once('open', () => {
    console.log('connected to DB!');
});
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(2200, () => {
    console.log('App listening on port 2200!');
});