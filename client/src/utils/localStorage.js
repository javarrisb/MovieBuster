export const getSavedMovieIds = () => {
    const saveMovieIds = localStorage.getItem('saved_movies')
    ? JSON.parse(localStorage.getItem('saved_movies'))
    : [];

    return saveMovieIds;
};

export const saveMovieIds = (movieIdArr) => {
    if (movieIdArr.length) {
        localStorage.setItem('save_movies', JSON.stringify(movieIdArr));
    } else {
        localStorage.removeItem('saved_movies');
    }
};

export const removeMovieId = (movieId) => {
    const saveMovieIds = localStorage.getItem('saved_movies')
    ? JSON.parse(localStorage.getItem('saved_movies'))
    : null;

    if (!saveMovieIds) {
        return false;
    }

    const updatedSavedMovieIds = saveMovieIds?.filter((saveMovieId) => savedMovieId !== movieId);
    localStorage.setItem('saved_movies', JSON.stringify(updatedSavedMovieIds));

    return true;
};