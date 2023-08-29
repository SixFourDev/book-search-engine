const Book = require('../models/Book');
const User = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      // Make sure the user is authenticated before proceeding
      await context.authMiddleware(context.req, context.res);
      // Use findById that finds this user by id
      return User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      // Use findOne to find by email
      const user = await User.findOne({ email });
      // if user doesn't exist throw auth error
      if (!user) {
        throw AuthenticationError;
      }
      
      const correctPassword = await user.isCorrectPassword(password);
      // if password isn't correct throw auth error
      if (!correctPassword) {
        throw AuthenticationError;
      }
      // Create token for user
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_, { username, email, password }) => {
      // Use create that takes in username email and password
      const user = await User.create({ username, email, password });
      // Create token for user
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { book }, context) => {
      // Make sure the user is authenticated before proceeding
      await context.authMiddleware(context.req, context.res);
      // Update the User by id and save the book under user
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true }
      ).catch(error => {
        console.log('Error saving book:', error);
        throw AuthenticationError;
      });

      return updatedUser;
    },
    removeBook: async (_, { bookId }, context) => {
      // Make sure the user is authenticated before proceeding
      await context.authMiddleware(context.req, context.res);
      // Update the User by id and remove book under user
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      ).catch(error => {
        console.log('Error removing book:', error);
        throw AuthenticationError;
      });

      return updatedUser;
    },
  },
};

module.exports = resolvers;
