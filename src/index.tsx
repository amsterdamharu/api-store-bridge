import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { applyMiddleware, compose, createStore } from 'redux';
import { productReducer } from './commercetools';
import { Provider } from 'react-redux';
const initialState = {
  data: {
    products: {
      data: {}, queries: {}
    }
  }
};
const rootReducer = (state: any, action: any) => {
  return productReducer(state, action);
};
//creating store with redux dev tools
const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      ({ dispatch, getState }) => (next) => (action) =>
        typeof action === 'function'
          ? action(dispatch, getState)
          : next(action)
    )
  )
);




ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
