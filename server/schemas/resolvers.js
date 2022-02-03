const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


//create resolver to serve the response to the helloworld query 
const resolvers = {
    Query: { 
        me: async (parent, args, context) => {
            if (context.user) {
            const userData = await User.findOne({})
            .select('-__v -password')
            .populate('thoughts')
            .populate('friends')

            return userData
            } 
            throw new AuthenticationError('Not logged in');
        },
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
    },

    Mutation: {
             addUser: async (parent, args) => {
            //create a new user with whatever is passed into args 
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('incorrect Credentials');
            }
            const token = signToken(user)

            return { token, user };
        },
        addThought: async (parent, args, context) => { 
            //check if user is logged in 
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $push: { thoughts: thought._id} },
                    //make sure updated is returned 
                    {new: true }
                );

                return thought;
            }
             
            throw new AuthenticationError('you need to be logged in!');
        },

        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId},
                    //reactions are stored as arrays on the thought model so youll use the mongo $push operator 
                    //because you are updating an existing thought the client will need to provide the corresponding thought id 
                    { $push: { reactions: { reactionBody, username: context.user.username} } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('you need to be logged in!');
        },

        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    //add to set because a user cant be friends with the same person twice 
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('you need to be logged in!');
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
