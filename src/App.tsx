import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Products from './components/Products';
import Checkout from './components/Checkout';
import Layout from './components/Layout';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true}>
          <Layout content={Products} />
        </Route>
        <Route path="/checkout">
          <Layout content={Checkout} />
        </Route>
      </Switch>
    </Router>


  );
}

export default App;
