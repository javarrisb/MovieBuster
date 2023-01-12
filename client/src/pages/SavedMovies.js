import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_MOVIE } from '../utils/mutation';
import Auth from '../utils/auth';
import { removeMovieId } from '../utils/localStorage';

const SavedMovies = () => {

  const { loading, data } = useQuery(GET_ME);
  const [removeMovie] = useMutation(REMOVE_MOVIE);

  const userData = data?.me || {};

  if (!userData?.username) {
    return (
      <h4>
        You have to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }
  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeMovie({
        variables: { movieId }
      });
      
      removeMovieId(movieId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, let them know
  if (loading) {
    return <h2>LOADING...</h2>;
  }

return (
    <>
    <Jumbotron fluid className='text-light bg-dark'>
        <Container>
            <h1>Seeing saved movies!</h1>
            </Container>
            </Jumbotron>
            <Container>
                <h2>
                    {userData.savedMovies.length
                    ? `Seeing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'};`
                    : 'You have no saved movies!'}
                    </h2>
                    <CardColumns>
                        {userData.savedMovies.map((movie) => {
                            return ( 
                                <Card key={movie.movieId} border='light'>
                                 {movie.poster_path ? <Card.Img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={`Poster for ${movie.original_title}`} 
                                 variant='top' /> : null }
                                 <Card.Body>
                                    <Card.Title>{movie.original_title}</Card.Title>
                                    <Card.Text>{movie.overview}</Card.Text>
                                    <Button className='btn-block btn-sucess' onClick={() => handleDeleteMovie(movie.movieId)}>
                                        Delete this Movie
                                    </Button>
                                 </Card.Body>

                                </Card>
                            );
                        })}
                        </CardColumns>
                        </Container>
                        </>
)
}

export default SavedMovies;