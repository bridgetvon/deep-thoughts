//create resolver to serve the response to the helloworld query 
const resolvers = {
    Query: { 
        helloWorld: () => {
            return 'Hello world!'
        }
    }
};

module.exports = resolvers;
