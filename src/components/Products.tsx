import React from 'react';
import { useProducts } from '../commercetools';
import Product from './Product';
function Products() {
  const productResult = useProducts();

  return (
    <div>
      <ul>
        {(productResult.resolved?.items || []).map(
          (product: any) => (
            <Product key={product.id} product={product} />
          )
        )}
      </ul>
    </div>)
}

export default React.memo(Products)
