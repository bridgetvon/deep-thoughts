const { User, Thought } = require('../models');


//create resolver to serve the response to the helloworld query 
const resolvers = {
    Query: { 
       thoughts: async (parent, {username}) => {
           //parent is a placeholder parameter so we can acces the username for the second parameter 
           const params = username ? { username } : {};
           return Thought.find().sort({ createdAt: -1 });
        },
        //get thought by id
        thought: async (parent, {_id}) => {
            return Thought.findOne({ _id });
        },
        //get all users 
        users: async () => {
            return User.find()
            .select('-__v  -password')
            .populate('friends')
            .populate('thoughts');
        },
        //get user by username 
        user: async (parent, {username}) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
    }
};

//using parameters so apoolo server library can pass data so we can have a more dynamic interaction with our servver
//the resolver can accept four arguments in the following order 
//1. parent: this is if we used nested resolvers to handle more complicated actions as it would hold reference to the resolver that executed the nested resolver function 
//2. args: this is an object of all the values passed into a query or mutation request as parameters 
//3. context: if we were to need the same data to be accessible by all resolvers such as logged in user status or API tokens this data will come through the context parameter 
//4. info: this will contain extra information about an operations current state 

module.exports = resolvers;
