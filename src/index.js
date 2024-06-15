import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  palatte: {
    primary: {
      main: "",
    },
  secondary: {
    main: "",
  },
},
typography:{
  h1: {
    fontSize: "3rem",
    fontWeight: 600,
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: 600,
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
  },
}
})
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <Provider store={store}>
          <App />
      </Provider>
    </ThemeProvider>
      
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
