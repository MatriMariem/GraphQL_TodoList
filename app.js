// ENTRY POINT OF THE BACKEND API
const express = require('express');
const bodyParser = require('body-parser');

const expressGraphql = require('express-graphql').graphqlHTTP;

const graphQlSchema = require('./graphql/schema.js');
const graphQlResolvers = require('./graphql/resolvers/allResolvers.js');

const mongoose = require('mongoose');
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

// CONNECT TO THE MONGO ATLAS DATABASE
mongoose.connect(
  process.env.DATABASE_CONNECT,
  { useNewUrlParser: true , useUnifiedTopology: true },
  () => {
    console.log('successfully connected to the database');
  }
);

// RUN THE APP
app.listen(3000, () => console.log('App Started'));
