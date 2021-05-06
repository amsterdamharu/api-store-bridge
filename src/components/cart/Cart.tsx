import CartItems from './CartItems';
import EmptyCart from './assets/empty-cart.png';
import { Link } from 'react-router-dom';
import { useCart } from '../../commercetools';
import './Cart.css';
import PickUpLocation from './PickUpLocation';
import { useState } from 'react';

export default function CartPage() {
  const [orderComplete, setOrderComplete] = useState(false);
  const { cartResult, checkout } = useCart();
  const { resolved: cart } = cartResult;

  const completeCheckout = () => {
    checkout();
    setOrderComplete(true);
  };

  return (
    <div>
      {!orderComplete && cart && cart?.lineItems?.length && (
        <div>
          <h2 className="title">SHOPPING CART</h2>
          <div className="cart-container">
            <div className="cart-content">
              <CartItems cart={cart} />

              <div className="right-side">
                <PickUpLocation />
                <div className="order-summary">
                  <h3>ORDER SUMMARY</h3>
                  <div className="summary-line">
                    <p>Subtotal</p>
                    <p>
                      ${cart.totalPrice.centAmount / 100}
                    </p>
                  </div>
                  <div className="summary-line">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="summary-line ">
                    <p className="total">Total</p>
                    <p className="total">
                      ${cart.totalPrice.centAmount / 100}
                    </p>
                  </div>
                </div>
                <div className="button-section">
                  <button
                    className="checkout-btn"
                    onClick={() => completeCheckout()}
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!cart && !orderComplete && (
        <div className="empty-cart">
          <img
            className="empty-cart-img"
            src={EmptyCart}
            alt=""
          />
          <div className="empty-cart-text">
            <h1>Your cart is empty</h1>
          </div>
          <Link className="shopping-btn" to="/">
            BACK TO SHOPPING
          </Link>
        </div>
      )}

      {orderComplete && (
        <div className="order-complete">
          <div className="thank-you">
            Thank you for your order!
          </div>
          <Link className="shopping-btn" to="/">
            BACK TO SHOPPING
          </Link>
        </div>
      )}
    </div>
  );
}
