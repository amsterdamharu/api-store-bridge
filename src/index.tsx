import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import { reducers } from './commercetools';
import { Provider } from 'react-redux';
import {
  REMOVE_CART_DATA,
  SET_SHIPPING_ADDRESS,
  SET_CHANNEL,
} from './actions';
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
    channels: EMPTY_DATA,
  },
  preferences: {
    country: 'US',
    locale: 'en',
    currency: 'USD',
    channel: EMPTY_DATA,
    shippingAddress: {
      additionalStreetInfo: 'a',
      city: 'a',
      country: 'US',
      email: 'a@b.com',
      firstName: 'a',
      lastName: 'a',
      postalCode: 'a',
      streetName: 'a',
    },
  },
};
const rootReducer = (state: any, action: any) => {
  if (action.type === REMOVE_CART_DATA) {
    return {
      ...state,
      data: {
        ...state.data,
        cart: EMPTY_DATA,
      },
    };
  }
  if (action.type === SET_SHIPPING_ADDRESS) {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        shippingAddress: action.payload,
      },
    };
  }
  if (action.type === SET_CHANNEL) {
    return {
      ...state,
      preferences: {
        ...state.preferences,
        channel: action.payload,
      },
    };
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
      //simple thunk middleware
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
