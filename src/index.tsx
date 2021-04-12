import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import { reducers } from './commercetools';
import { Provider } from 'react-redux';
import { REMOVE_CART_DATA } from './actions';
const EMPTY_DATA = {
  data: {},
  queries: {},
  actions: {},
};
const initialState = {
  data: {
    products: EMPTY_DATA,
    cart: EMPTY_DATA,
    orders: EMPTY_DATA,
    channels: EMPTY_DATA
  },
  preferences: {
    country: 'US',
    locale: 'en',
    currency: 'USD',
    shippingAddress: {
      additionalStreetInfo: "a",
      city: "a",
      country: "US",
      email: "a@b.com",
      firstName: "a",
      lastName: "a",
      postalCode: "a",
      streetName: "a"
    }
  },
};
const rootReducer = (state: any, action: any) => {
  if (action.type === REMOVE_CART_DATA) {
    return {
      ...state,
      data: {
        ...state.data,
        cart: EMPTY_DATA
      }
    }
  }
  return reducers.reduce(
    (state, reducer) => reducer(state, action),
    state
  );
};
//creating store with redux dev tools
const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
  compose;
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
