import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectCountry,
  useCart,
  useChannels,
} from '../commercetools';
import Channel from './Chanel';
import CartItems from './CartItems';
import EmptyCart from '../assets/empty-cart.png';
import { selectChannel } from '../commercetools/selectors';

function Checkout() {
  const { cartResult, checkout } = useCart();
  const { resolved: cart } = cartResult;
  const country = useSelector(selectCountry);
  const query = useMemo(() => ({ country }), [country]);
  const channels = useChannels(query)?.resolved?.items;

  return (
    <div>
      <h1 className="title">Shopping Cart</h1>
      {cart && cart?.lineItems?.length && (
        <div>
          <div className="checkout-content">
            <div>
              <CartItems cart={cart} />
            </div>
            <div>
              <div className="checkout-section">
                <h2>Pickup Location</h2>
                <div className="channels"></div>
                {cart &&
                  channels &&
                  channels.map((channel: any) => (
                    <Channel
                      key={channel.id}
                      channel={channel}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="checkout-btn-section">
            <button
              className="checkout-btn"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {!cart && (
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
    </div>
  );
}

export default Checkout;
