const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema.js');
const graphQlResolvers = require('./graphql/resolvers/allResolvers.js');
const auth = require('./auth');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.use(auth);

app.use(
  '/',
  expressGraphql({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(
  process.env.DATABASE_CONNECT,
  { useNewUrlParser: true , useUnifiedTopology: true },
  () => {
    console.log('successfully connected to the database');
  }
);

app.listen(3000, () => console.log('App Started'));
