import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { findTMDB } from '../utils/API';
import { useMutation } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutation';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';

const SearchMovies = () => {
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

    const [saveMovie] = useMutation(SAVE_MOVIE);

    useEffect(() => {
        return () => saveMovieIds(savedMovieIds);
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }

        try {
            const response = await findTMDB(searchInput);

            if (!response.ok) {
                throw new Error('There was a problem!');
            }

            const { items } = await response.json();

            const movieData = items.map((movie) => ({
                original_title: movie.original_title,
                overview: movie.overview || ['There is no description to show'],
                rating: movie.rating,
                runtime: movie.runtime,
                release_date: movie.release_date,
                movieId: movie.id,
                poster_path: movie.poster_path,
                tagline: movie.tagline
            }));
            
            setSearchedMovies(movieData);
            setSearchInput('');
        } catch(err) {
            console.error(err);
        }
    };

    const handleSaveMovie = async (movieId) => {

        const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);

        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            const { data } = await saveMovie({
                variables: { input: { ...movieToSave } }
            });
            console.log(data);

            setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <Jumbotron fluid className='text-light bg-dark'>
            <Container>
                <h1>Search Movies here!</h1>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Row>
                        <Col xs={12} md={8}>
                            <Form.Control
                            name='searchInput'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type='text'
                            size='lg'
                            placeholder='Search for a movie'
                            />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type='submit' variant='success' size='lg'>
                                    Submit Search
                                    </Button>
                                    </Col>
                                    </Form.Row>
                                    </Form>
                                    </Container>
                                    </Jumbotron>

                                    <Container>
                                        <h2>
                                           {searchedMovies.length
                                           ?  `Seeing ${searchedMovies.length} results:`
                                        : 'Search for a movie to start'} 
                                        </h2>
                                        <CardColumns>
                                            {searchedMovies.map((movie) => {
                                             return (
                                                <Card key={movie.movieId} border='light'>
                                                    {movie.poster_path ? (
                                                        <Card.Img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt={`Poster for ${movie.original_title}`} variant='top' />
                                                    ) :null}
                                                    <Card.Body>
                                                        <p className='small'>Release Date: {movie.release_date}</p>
                                                        <p className='small'>Rating: {movie.rating} /10</p>
                                                        <p className='small'>Tagline: {movie.tagline}</p>
                                                        {Auth.loggedIn() && (
                                                            <Button 
                                                            disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                                                            className='btn-block btn-info'
                                                            onClick={() => handleSaveMovie(movie.movieId)}>
                                                                {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                                                                ? 'This movie has been saved already!'
                                                            : 'Save this Movie!'}
                                                            </Button>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                             );   
                                            })}
                                        </CardColumns>
                                    </Container>
            </>
    );
};

export default SearchMovies;