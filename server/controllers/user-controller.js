const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
    async getSingleUser({ user = null, params }, res) {
        const foundUser = await User.findOne({
            $or: [{ _id: user ? user._id : params.id }, { username: params.username }], 
        });

        if (!foundUser) {
            return res.status(400).json({ message: 'Sorry, cannot find user with this id!'});
        }

        res.json(foundUser);
    },

    async createUser({ body }, res) {
        const user = await User.create(body);

        if (!user) {
            return res.status(400).json({message: 'There is something wrong!'});
        }
        const token = signToken(user);
        res.json({ token, user });
    },

    async login({ body }, res) {
        const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
        if (!user) {
            return res.status(400).json({ message: 'Sorry, cannot find this user!'});
        }

        const correctPw = await user.isCorrectPassword(body.password);
        
        if (!correctPw) {
            return res.status(400).json({ message: 'Incorrect password. Please try again.'});
        }
        const token = signToken(user);
        res.json({ token, user });
    },

    async saveMovie({ user, body}, res) {
        console.log(user);
        try {
            const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedMovies: body } },
            { new: true, runValidators: true }
            );
            return res.json(updatedUser);
        } catch(err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async deleteMovie({ user, params }, res) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedMovies: { movieId: params.movieId } } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "Sorry, could not find user with this id!"});
        }
        return res.json(updatedUser);
    },

};
