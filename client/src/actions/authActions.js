import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)

    .then(res => {
      //Save to local storage
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem("jwtToken", token);
      // Set token to auth header
      setAuthToken(token);
      // Decode Token for user data
      const decodedUser = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decodedUser));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set Logged in user

export const setCurrentUser = decodedUser => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedUser
  };
};

//Logout user
export const logoutUser = () => dispatch => {
  // Remove token from cookies
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  //set current user to null, and set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
