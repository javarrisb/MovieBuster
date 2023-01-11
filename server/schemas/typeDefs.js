const { gql } = require('apollo-server-express')

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        savedMovies: [Movie]
    }
    
    type Movie {
        original_title: String
        overview: String
        rating: Float
        runtime: Int
        release_date: String
        movieId: ID
        poster_path: String
        tagline: String
    }
    
    input MovieInput {
        original_title: String
        overview: String
        rating: Float
        runtime: Int
        release_date: String
        movieId: ID
        poster_path: String
        tagline: String
    }

    type Query {
        me: User
    }

    type Mutation {
      login(email: String!, password: String!): Auth
      addUser(username: String!, email: String!, password: String!): Auth
      saveMovie(input: MovieInput): User
      removeMovie(movieId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
    
    `;

module.exports = typeDefs;