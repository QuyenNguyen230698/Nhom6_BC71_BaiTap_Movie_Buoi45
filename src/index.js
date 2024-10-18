import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userSlice from './pages/reduxMovie/userSlice';
import spinnerSlice from './pages/reduxMovie/spinnerSlice';

const root = ReactDOM.createRoot(document.getElementById('root'));
export let store = configureStore({
  reducer: {
    userSlice: userSlice,
    spinnerSlice: spinnerSlice,
  }
})
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
