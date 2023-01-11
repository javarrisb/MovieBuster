const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select(
                    "-__v -password"
                );

                return userData;
            }

            throw new AuthenticationError("You are not logged in");
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("Improper credentials! ");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Improper credentials!");
            }

            const token = signToken(user);
            return { token, user };
        },
        saveMovie: async(parent, { input }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedMovies: input } },
                    { new: true }
                );

                return updateUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },
        removeMovie: async (parent, { movieId }, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    {$pull: { savedMovies: { movieId } } },
                    { new: true }
                );

                return updateUser;
            }

            throw new AuthenticationError("You need to be logged in!");
        },

    },
};

module.exports = resolvers;