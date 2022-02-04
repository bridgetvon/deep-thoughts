//create the tyoe definition 

//import the gql tagged template function 
//tagged templates are an advanced use of templete literals 
const { gql } = require('apollo-server-express');

//create typedefs 
//type query datType {} is how you define a query 
const typeDefs = gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int 
        thoughts: [Thought]
        friends: [User]
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addThought(thoughtText: String!): Thought
        addReaction(thoughtId: ID!, reactionBody: String!): Thought
        addFriend(friendId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;
//(usernameL String) defined thoughts so that it could recieve a parameter if we wanted 
//the parameter would be username and would have a string data type 

// the ! excalmmation point indicates that for a query to be carried out the data must exist 

//when we run a thought query we can also list the reactions field to get back an array of reaction data for each though 

// Mutation queries modify data in the data store and returns a value. It can be used to insert, update, or delete data. Mutations are defined as a part of the schema.

//export typeDefs
module.exports = typeDefs;