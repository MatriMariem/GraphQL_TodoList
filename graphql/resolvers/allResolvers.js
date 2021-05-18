const generalResolver = require('./generalResolver');
const authResolver = require('./authResolver');
const taskResolver = require('./taskResolver');

const graphQlResolvers = {

  ...generalResolver,
  ...authResolver,
  ...taskResolver,

};

module.exports = graphQlResolvers;
