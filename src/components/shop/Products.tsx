import React from 'react';
import { useProducts } from '../../commercetools';
import Product from './Product';
import './Products.css';

function Products() {
  const productResult = useProducts();

  return (
    <div>
      <h1 className="title">PRODUCTS</h1>
      <ul className="product-list">
        {(productResult.resolved?.items || []).map(
          (product: any) => (
            <Product key={product.id} product={product} />
          )
        )}
      </ul>
    </div>
  );
}

export default React.memo(Products);
