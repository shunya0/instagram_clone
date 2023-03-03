// This is the config used in order to send
// our token with Axios requests
export const config = (jwt) => {
	return {
		headers: {
			Authorization: "Bearer " + jwt,
			authorization: "Bearer " + jwt,
		},
	};
};

/**
 * EndPoints of the API used in the code
 */

// CreatePost Screen
export const CREATE_POST_URL = `http://localhost:5000/createpost`;

// Home Screen
export const ALL_POST_URL = `http://localhost:5000/allpost`;

// Login Screen
export const LOGIN_URL = `http://localhost:5000/signin`;

// SignUp Screen
export const SIGNUP_URL = `http://localhost:5000/signup`;

// All Likes
export const ALL_LIKES = `http://localhost:5000/alllikes`;