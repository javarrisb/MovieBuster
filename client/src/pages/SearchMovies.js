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
        return () => saveMovieIds(saveMovieIds);
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

        const movieToSave = searchMovies.find((movie) => movie.movieId === movieId);

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
}