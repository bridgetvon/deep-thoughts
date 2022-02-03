const jwt = require('jsonwebtoken');

//this should usually be in an environment variable 
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function({ req }) {
      //allows the token to be sent via req.body, req.query or headers 
      let token = req.body.token || req.query.token || req.headers.authorization;

      //seperate "bearer" from "tokenvalues"
      if(req.headers.authorization) {
          token = token 
          .split('')
          .pop()
          .trim();
      }

      //if no token return request object as is 
      if (!token) {
          return req;
      }

      //if the secret on jwt verify doesnt match jwt sign the object will not be decoded and an error is thrown 
      //we dont want to throw an error on every request the try ...catch method mutes the error  
      try {
          //decode and attach user data to request object 
          const { data } = jwt.verify(token, secret, { maxAge: expiration});
          req.user = data;
      } catch {
          console.log('Invalid token');
      }

      //return the request object 
      return req;
  }
};

//Note that the secret has nothing to do with encoding. The secret merely enables the server to verify whether it recognizes this token.