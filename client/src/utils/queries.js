import { gql } from '@apollo/client';

export const GET_ME = gql`
{
    me {
        _id
        username 
        email
        savedMovies {
            original_title
            overview
            rating
            runtime
            release_date
            movieId
            poster_path
            tagline
        }
        
    }
}
`
