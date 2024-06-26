import axios from 'axios';

// Create an instance of Axios with default configuration
const instance = axios.create({
  // baseURL: 'http://127.0.0.1:8000', // Your API base URL
  baseURL: 'https://social-media-clone-mern-stack.onrender.com/', // Your API base URL
  withCredentials: true, // Set withCredentials to true to send cookies
});

export default instance;
