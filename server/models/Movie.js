const { Schema } = require('mongoose');

const movieSchema = new Schema ({
    original_title: {
        type: String,
        required: true 
    },
    overview: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    runtime: {
        type: Number
    },
    release_date: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    poster_path: {
        type: String
    },
    tagline: {
        type: String,
        required: true
    }
});

module.exports = movieSchema;