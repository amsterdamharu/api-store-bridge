import { useCallback } from 'react';
import { useCart } from '../../commercetools';

function Product({ product }: any) {
  const { addToCart } = useCart();
  const addHandler = useCallback(() => {
    addToCart(product.id, product.masterVariant.id);
  }, [addToCart, product.id, product.masterVariant.id]);

  return (
    <li className="product-wrap">
      <img
        className="product-img"
        src={product.masterVariant.images[0].url}
        alt={product.name.en}
      ></img>
      <div className="product-name">{product.name.en}</div>
      <div className="lower-part">
        <button
          className="add-to-cart-btn"
          onClick={addHandler}
        >
          Add to Cart
        </button>
        <div className="price">
          $
          {product.masterVariant.price.value.centAmount /
            100}
        </div>
      </div>
    </li>
  );
}

export default Product;
