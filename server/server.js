const express = require('express');
//import apollo server 
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const path = require('path');

//import type def and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  //create a new apollo server and pass in schema data 
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    //return the headers for JWT 
    context: authMiddleware
  });

  //start the apollo server 
  await server.start();

  //integrate our apollow server with the express app as middleware 
  server.applyMiddleware({ app });

  //log where we can go to test GQL api 
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

//initialize the apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serve static assets 
//first we check to see if the node environemtn is in production if it is we instruct express to serve any files in the react apps build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
//then we created a wildcard get route for the server 
//if we make a get request from any location on the server that doesnt have an explicit route defined respond witht the production ready react code 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
