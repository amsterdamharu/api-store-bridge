import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Products from './components/Products';
import Checkout from './components/Checkout';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact={true}>
          <Products />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
