import { toast } from 'react-toastify';
import axios from '../axiosConfig.js';

import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';


const initialState = {
    loading: true,
    user: null,
    posts: [],
    userPosts: [],
    error: ''
}


const reduxSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setAuthStatus: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        setPosts : (state, action) => {
            state.posts = action.payload;
        },
        setUserPosts: (state, action) => {
            state.userPosts = action.payload;
        }
    },
    extraReducers: (builder) => {
    }
})



// check login status
export const fetchLoginStatus = createAsyncThunk('users/fetchLoginStatus', async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/user/loggeduser');
      console.log(response.data.user)
      thunkAPI.dispatch(actions.setAuthStatus(response.data.user)); // Dispatch the action with user data
    } catch (err) {
      thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
    }
  });


//   signup function
export const signup = createAsyncThunk('users/signup', async (data, thunkAPI) => {
    try {
        console.log('signup')
      const response = await axios.post('/api/user/signup', data);
      console.log(response.data)
      thunkAPI.dispatch(actions.setAuthStatus(response.data.user)); // Dispatch the action with user data
      toast.success('signed up successfully') // Display a success toast
    } catch (err) {
      thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error(err.response.data.message); // Display an error toast
    
    }
  });
  

//   login function
export const login = createAsyncThunk('users/login', async (data, thunkAPI) => {
    try {
      const response = await axios.post('/api/user/login', data);
      thunkAPI.dispatch(actions.setAuthStatus(response.data.user)); // Dispatch the action with user data
    //   localStorage.setItem("user", response.data.user)
        toast.success(response.data.message)
    } catch (err) {
      thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText)); // Display an error toast
    }
  });


//   logout function
export const logout = createAsyncThunk('users/logout', async (_, thunkAPI) => {
    try {
        console.log('logout')
      const response = await axios.post('/api/user/logout');
      thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      toast.success('logged out successfully'); // Display a success toast
    } catch (err) {
      thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      toast.error('Failed to log out'); // Display an error toast
      toast.error(err.response.data.message); // Display an error toast
    }
  });


//   get posts function
export const getPosts = createAsyncThunk('users/getPosts', async ( queryParams, thunkAPI) => {
    try {
      const response = await axios.get('/api/post/getpost', { params: queryParams });
      console.log(response.data.posts)    
      thunkAPI.dispatch(actions.setPosts(response.data.posts)); // Dispatch the action with user data
    //   toast.success(response.data.message)
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });

//   get a post 
export const getSinglePost = createAsyncThunk('users/getSinglePost', async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/post/getsinglepost/${id}`);
      console.log(response.data)    
      return response.data;
    //   thunkAPI.dispatch(actions.setPosts([response.data.post])); // Dispatch the action with user data
    //   toast.success(response.data.message)
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });


//   like a post
export const likePost = createAsyncThunk('users/likePost', async ({id, posts, userPosts, index}, thunkAPI) => {
    try {
      const response = await axios.post(`/api/post/likepost/${id}`);
      const updatedPost = response.data.post;

    //   check whether to like from the userPost page or profile page
      if(userPosts){
        let newPosts = [...userPosts];
        newPosts[index] = updatedPost;
        thunkAPI.dispatch(actions.setUserPosts(newPosts)); // Assuming you have a setUserPosts action
      }else{
        let newPosts = [...posts];
        newPosts[index] = updatedPost;
        thunkAPI.dispatch(actions.setPosts(newPosts)); // Assuming you have a setPosts action
      }
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response || err); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });


//   delete a post
export const deletePost = createAsyncThunk('users/deletePost', async ({id, posts, index}, thunkAPI) => {
    try {
        // Find the index of the post in the existing posts array
        let newPosts = [...posts];
        newPosts.splice(index, 1); // Remove 1 element at the specified index
            // Update the state with the updated posts array
            thunkAPI.dispatch(actions.setPosts(newPosts)); // Assuming you have a setPosts action
        const response = await axios.delete(`/api/post/deletepost/${id}`);
        const updatedPost = response.data.post;

    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response || err); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });

//   CREATE A POST
export const createPost = createAsyncThunk('users/createPost', async ({data, posts}, thunkAPI) => {
    try {
       // Create FormData object to send both text content and file data
        const formData = new FormData();
        formData.append('content', data.content);
        formData.append('file', data.file);
      const response = await axios.post('/api/post/create', formData);
      const updatedPost = response.data.post;
      console.log((posts))
      const newPost = [...posts];
      console.log(newPost)
      newPost.unshift(updatedPost);
        // Update the state with the updated posts array
        thunkAPI.dispatch(actions.setPosts(newPost)); // Assuming you have a setPosts action
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response || err); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });

//   get posts of a user
export const getUserPosts = createAsyncThunk('users/getUserPosts', async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/post/getuserposts/${id}`);
      thunkAPI.dispatch(actions.setUserPosts(response.data.posts)); // Dispatch the action with user data
    //   toast.success(response.data.message)
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });

//   update user profile
export const updateProfile = createAsyncThunk('users/updateprofile', async (data, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('profile', data.file);
        formData.append('password', data.password);
        formData.append('name', data.name);
        formData.append('email', data.email);
      const response = await axios.put(`/api/user/update-profile`, formData);
      thunkAPI.dispatch(actions.setAuthStatus(response.data.user)); // Dispatch the action with user data
      toast.success(response.data.message);
    } catch (err) {
    //   thunkAPI.dispatch(actions.setAuthStatus(null)); // Dispatch the action with null for user
      console.log(err.response); // Log the error response
      toast.error((err.response.data.message) ? (err.response.data.message) : (err.response.statusText));
    }
  });

export const reducer = reduxSlice.reducer;
export const actions = reduxSlice.actions;
console.log(actions)
export const selector = (state) => state.reducer;