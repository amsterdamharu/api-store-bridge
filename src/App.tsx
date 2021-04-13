import React from 'react';
import './App.css';
import Product from './components/Product';
import Checkout from './components/Checkout';
import useProducts from './commercetools/hooks/useProducts';
function App() {
  const productResult = useProducts();
  return (
    <div>
      <div>
        <Checkout />
      </div>
      <div>
        <ul>
          {(productResult.resolved?.items || []).map(
            (product: any) => (
              <Product key={product.id} product={product} />
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
