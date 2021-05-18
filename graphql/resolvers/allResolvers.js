const generalResolver = require('./general');
const authResolver = require('./auth');

const graphQlResolvers = {

  ...generalResolver,
  ...authResolver,

};

module.exports = graphQlResolvers;
