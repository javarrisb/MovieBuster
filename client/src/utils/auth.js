// use to decode a token and get user info from it 
import decode from 'jwt-decode';

class AuthService {
    // get the user data
    getProfile() {
        return decode(this.getToken());
    }

    loggedIn(){
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    // checks if token is expired
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch ( err) {
            return false;
        }
    }

    getToken() {
        // Fetches the user token from localStorage
        return localStorage.getItem('id_token');
    }

    login(idToken) {
        // Saves the user token in localStorage
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }

    logout() {
        // Deletes user token and data from localStorage
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

export default new AuthService();