const router = require('express').Router();
const {
    getSingleUser,
    createUser,
    login,
    saveMovie,
    deleteMovie
} = require('../../controllers/user-controller');

const { authMiddleware } = require('../../utils/auth');

router.route('/').post(createUser).put(authMiddleware, saveMovie);

router.route('/login').post(login);

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/movies/:movieId').delete(authMiddleware, deleteMovie);

module.exports = router;