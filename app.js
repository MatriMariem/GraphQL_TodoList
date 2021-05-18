const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());


app.use(
  '/graphql',
  expressGraphql({
    schema: ,
    rootValue: ,
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
