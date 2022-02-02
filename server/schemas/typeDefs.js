//create the tyoe definition 

//import the gql tagged template function 
//tagged templates are an advanced use of templete literals 
const { gql } = require('apollo-server-express');

//create typedefs 
//type query datType {} is how you define a query 
const typeDefs = gql`
    type Query {
        helloWorld: String
    }
`;

//export typeDefs
module.exports = typeDefs;